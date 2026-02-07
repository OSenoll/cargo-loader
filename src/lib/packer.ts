import type { CargoItem, ContainerType, PackedItem, PackingResult } from '../types';
import { calculateVolume } from './containers';

// 3D pozisyon ve boyut icin interface
interface Box {
  x: number;
  y: number;
  z: number;
  width: number;  // x ekseni
  height: number; // y ekseni
  depth: number;  // z ekseni
}

// Bos alan (free space) temsili
interface Space extends Box {}

// Esya siralama onceligi
function getItemPriority(item: CargoItem): number {
  let priority = 0;

  // Altta olmali olanlar en yuksek oncelik
  if (item.constraints.includes('must_be_on_bottom')) priority += 1000;

  // Agir esyalar yuksek oncelik (agirdan hafife)
  if (item.constraints.includes('heavy_bottom')) priority += 500;

  // Agirliga gore (agirdan hafife)
  priority += item.weight;

  return priority;
}

// Esyalari kopyala ve adet kadar cokla
function expandItems(items: CargoItem[]): CargoItem[] {
  const expanded: CargoItem[] = [];

  for (const item of items) {
    for (let i = 0; i < item.quantity; i++) {
      expanded.push({
        ...item,
        id: `${item.id}-${i}`,
        quantity: 1
      });
    }
  }

  return expanded;
}

// Esyalari oncelik sirasina gore sirala
function sortItemsByPriority(items: CargoItem[]): CargoItem[] {
  return [...items].sort((a, b) => {
    const priorityA = getItemPriority(a);
    const priorityB = getItemPriority(b);

    if (priorityB !== priorityA) {
      return priorityB - priorityA; // Yuksek oncelik once
    }

    // Ayni oncelikte hacme gore (buyukten kucuge)
    const volumeA = a.length * a.width * a.height;
    const volumeB = b.length * b.width * b.height;
    return volumeB - volumeA;
  });
}

// Esya dondurulebilir mi kontrol et
function canRotate(item: CargoItem): boolean {
  return !item.constraints.includes('no_rotate');
}

// Esyanin tum mumkun rotasyonlarini getir
function getRotations(item: CargoItem): { width: number; height: number; depth: number }[] {
  const { length, width, height } = item;

  if (!canRotate(item)) {
    return [{ width: length, height, depth: width }];
  }

  // Tum 6 rotasyon (sadece dikine duran)
  const rotations = [
    { width: length, height, depth: width },
    { width: width, height, depth: length },
    { width: length, height: width, depth: height },
    { width: height, height: width, depth: length },
    { width: width, height: length, depth: height },
    { width: height, height: length, depth: width }
  ];

  // Benzersiz rotasyonlari filtrele
  const unique: typeof rotations = [];
  for (const rot of rotations) {
    const exists = unique.some(
      u => u.width === rot.width && u.height === rot.height && u.depth === rot.depth
    );
    if (!exists) unique.push(rot);
  }

  return unique;
}

// Esya bos alana sigar mi kontrol et
function fitsInSpace(
  dims: { width: number; height: number; depth: number },
  space: Space
): boolean {
  return (
    dims.width <= space.width &&
    dims.height <= space.height &&
    dims.depth <= space.depth
  );
}

// Ustune bir sey konulmus mu kontrol et (must_be_on_top kontrolu icin)
function hasItemOnTop(
  position: { x: number; y: number; z: number },
  dims: { width: number; height: number; depth: number },
  packedItems: PackedItem[]
): boolean {
  for (const packed of packedItems) {
    // Packed item bu itemin ustunde mi?
    if (packed.position.y >= position.y + dims.height) {
      // XZ duzleminde cakisiyor mu?
      const overlapX =
        packed.position.x < position.x + dims.width &&
        packed.position.x + packed.dimensions.width > position.x;
      const overlapZ =
        packed.position.z < position.z + dims.depth &&
        packed.position.z + packed.dimensions.depth > position.z;

      if (overlapX && overlapZ) {
        return true;
      }
    }
  }
  return false;
}

// Kirilgan esya ustundeki toplam agirlik
function getWeightOnTop(
  position: { x: number; y: number; z: number },
  dims: { width: number; height: number; depth: number },
  packedItems: PackedItem[]
): number {
  let totalWeight = 0;

  for (const packed of packedItems) {
    if (packed.position.y >= position.y + dims.height) {
      const overlapX =
        packed.position.x < position.x + dims.width &&
        packed.position.x + packed.dimensions.width > position.x;
      const overlapZ =
        packed.position.z < position.z + dims.depth &&
        packed.position.z + packed.dimensions.depth > position.z;

      if (overlapX && overlapZ) {
        totalWeight += packed.item.weight;
      }
    }
  }

  return totalWeight;
}

// Bos alanlar listesini guncelle
function updateSpaces(
  spaces: Space[],
  placedBox: Box
): Space[] {
  const newSpaces: Space[] = [];

  for (const space of spaces) {
    // Yerlesilen kutu ile cakisiyor mu?
    const overlapsX =
      placedBox.x < space.x + space.width &&
      placedBox.x + placedBox.width > space.x;
    const overlapsY =
      placedBox.y < space.y + space.height &&
      placedBox.y + placedBox.height > space.y;
    const overlapsZ =
      placedBox.z < space.z + space.depth &&
      placedBox.z + placedBox.depth > space.z;

    if (overlapsX && overlapsY && overlapsZ) {
      // 6 yeni potansiyel bos alan olustur

      // Sol (+X yonunde kalan)
      if (placedBox.x + placedBox.width < space.x + space.width) {
        newSpaces.push({
          x: placedBox.x + placedBox.width,
          y: space.y,
          z: space.z,
          width: space.x + space.width - (placedBox.x + placedBox.width),
          height: space.height,
          depth: space.depth
        });
      }

      // Sag (-X yonunde kalan)
      if (placedBox.x > space.x) {
        newSpaces.push({
          x: space.x,
          y: space.y,
          z: space.z,
          width: placedBox.x - space.x,
          height: space.height,
          depth: space.depth
        });
      }

      // Ust (+Y yonunde kalan)
      if (placedBox.y + placedBox.height < space.y + space.height) {
        newSpaces.push({
          x: space.x,
          y: placedBox.y + placedBox.height,
          z: space.z,
          width: space.width,
          height: space.y + space.height - (placedBox.y + placedBox.height),
          depth: space.depth
        });
      }

      // On (+Z yonunde kalan)
      if (placedBox.z + placedBox.depth < space.z + space.depth) {
        newSpaces.push({
          x: space.x,
          y: space.y,
          z: placedBox.z + placedBox.depth,
          width: space.width,
          height: space.height,
          depth: space.z + space.depth - (placedBox.z + placedBox.depth)
        });
      }

      // Arka (-Z yonunde kalan)
      if (placedBox.z > space.z) {
        newSpaces.push({
          x: space.x,
          y: space.y,
          z: space.z,
          width: space.width,
          height: space.height,
          depth: placedBox.z - space.z
        });
      }
    } else {
      // Cakisma yok, alani koru
      newSpaces.push(space);
    }
  }

  // Cok kucuk alanlari filtrele (min 5cm)
  const MIN_SIZE = 5;
  const filtered = newSpaces.filter(
    s => s.width >= MIN_SIZE && s.height >= MIN_SIZE && s.depth >= MIN_SIZE
  );

  // Alanlari siralayarak dondur (once alt, sonra arka, sonra sol)
  return filtered.sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y;
    if (a.z !== b.z) return a.z - b.z;
    return a.x - b.x;
  });
}

// Ana packing fonksiyonu
export function packItems(
  items: CargoItem[],
  container: ContainerType
): PackingResult {
  // Esyalari cokla ve sirala
  const expandedItems = expandItems(items);
  const sortedItems = sortItemsByPriority(expandedItems);

  const packedItems: PackedItem[] = [];
  const unpackedItems: CargoItem[] = [];

  // Baslangicta tum konteyner bos alan
  let spaces: Space[] = [
    {
      x: 0,
      y: 0,
      z: 0,
      width: container.length,
      height: container.height,
      depth: container.width
    }
  ];

  let currentWeight = 0;

  // Her esya icin
  for (const item of sortedItems) {
    // Agirlik limiti kontrolu
    if (currentWeight + item.weight > container.maxWeight) {
      unpackedItems.push(item);
      continue;
    }

    let placed = false;

    // Rotasyonlari dene
    const rotations = getRotations(item);

    // Tum bos alanlar ve rotasyonlar icin en iyi pozisyonu bul
    let bestFit: {
      space: Space;
      rotation: { width: number; height: number; depth: number };
      spaceIndex: number;
    } | null = null;

    for (let spaceIndex = 0; spaceIndex < spaces.length; spaceIndex++) {
      const space = spaces[spaceIndex];

      // Ustte olmali kisitlamasi icin ust alanlara yerlestirme
      if (item.constraints.includes('must_be_on_top')) {
        // En ustteki bos alanlar once denenecek
        // Siralama zaten y'ye gore, yuksek y degerleri tercih edilmeli
      }

      for (const rotation of rotations) {
        if (fitsInSpace(rotation, space)) {
          // Kirilgan esya kontrolu - ustune sey konulmus mu?
          if (item.constraints.includes('fragile')) {
            const weightOnTop = getWeightOnTop(
              { x: space.x, y: space.y, z: space.z },
              rotation,
              packedItems
            );
            if (weightOnTop > 20) continue; // Max 20kg
          }

          // En iyi fit: en kucuk bos alan
          if (
            !bestFit ||
            space.width * space.height * space.depth <
              bestFit.space.width * bestFit.space.height * bestFit.space.depth
          ) {
            bestFit = { space, rotation, spaceIndex };
          }
        }
      }
    }

    if (bestFit) {
      const { space, rotation } = bestFit;

      const packedItem: PackedItem = {
        item,
        position: { x: space.x, y: space.y, z: space.z },
        rotation: { x: 0, y: 0, z: 0 },
        dimensions: rotation
      };

      packedItems.push(packedItem);
      currentWeight += item.weight;

      // Bos alanlari guncelle
      spaces = updateSpaces(spaces, {
        x: space.x,
        y: space.y,
        z: space.z,
        width: rotation.width,
        height: rotation.height,
        depth: rotation.depth
      });

      placed = true;
    }

    if (!placed) {
      unpackedItems.push(item);
    }
  }

  // Ustte olmali kisitlamasini dogrula ve duzelt
  const mustBeOnTopItems = packedItems.filter(p =>
    p.item.constraints.includes('must_be_on_top')
  );

  for (const topItem of mustBeOnTopItems) {
    const hasOnTop = hasItemOnTop(
      topItem.position,
      topItem.dimensions,
      packedItems.filter(p => p !== topItem)
    );

    if (hasOnTop) {
      // Bu esya ustune bir sey konulmus, sigmayan olarak isaretle
      const index = packedItems.indexOf(topItem);
      if (index > -1) {
        packedItems.splice(index, 1);
        unpackedItems.push(topItem.item);
      }
    }
  }

  // Sonuclari hesapla
  const containerVolume = calculateVolume(container.length, container.width, container.height);
  const usedVolume = packedItems.reduce(
    (acc, p) =>
      acc + calculateVolume(p.dimensions.width, p.dimensions.height, p.dimensions.depth),
    0
  );
  const totalWeight = packedItems.reduce((acc, p) => acc + p.item.weight, 0);

  return {
    packedItems,
    unpackedItems,
    volumeUtilization: (usedVolume / containerVolume) * 100,
    weightUtilization: (totalWeight / container.maxWeight) * 100,
    totalVolume: containerVolume,
    usedVolume,
    totalWeight
  };
}
