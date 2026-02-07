// Dil tipleri
export type Language = 'en' | 'tr';

// Kisitlama tipleri
export type ConstraintType =
  | 'must_be_on_top'      // Ustte olmali - ustune bir sey konulamaz
  | 'must_be_on_bottom'   // Altta olmali
  | 'fragile'             // Kirilgan - max 20kg ustune
  | 'no_rotate'           // Dondurulemez
  | 'heavy_bottom';       // Agirlik merkezi - altta olmali

export interface Constraint {
  type: ConstraintType;
  label: string;
  icon: string;
  color: string;
  description: string;
}

// Esya tipi
export interface CargoItem {
  id: string;
  name: string;
  length: number;      // cm
  width: number;       // cm
  height: number;      // cm
  weight: number;      // kg
  quantity: number;
  constraints: ConstraintType[];
  color: string;
}

// Yerlestirilmis esya
export interface PackedItem {
  item: CargoItem;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

// Konteyner tipi
export interface ContainerType {
  id: string;
  name: string;
  length: number;      // cm (ic olcu)
  width: number;       // cm
  height: number;      // cm
  maxWeight: number;   // kg
  color: string;
}

// Packing sonucu
export interface PackingResult {
  packedItems: PackedItem[];
  unpackedItems: CargoItem[];
  volumeUtilization: number;
  weightUtilization: number;
  totalVolume: number;
  usedVolume: number;
  totalWeight: number;
}

// Store state tipi
export interface AppState {
  // Dil
  language: Language;

  // Konteyner
  selectedContainer: ContainerType;
  containers: ContainerType[];

  // Esyalar
  items: CargoItem[];

  // Packing sonucu
  packingResult: PackingResult | null;
  isPacking: boolean;

  // Secili esya (3D'de highlight icin)
  selectedItemId: string | null;

  // Actions
  setLanguage: (language: Language) => void;
  setSelectedContainer: (container: ContainerType) => void;
  addItem: (item: Omit<CargoItem, 'id' | 'color'>) => void;
  updateItem: (id: string, updates: Partial<CargoItem>) => void;
  removeItem: (id: string) => void;
  clearItems: () => void;
  setPackingResult: (result: PackingResult | null) => void;
  setIsPacking: (isPacking: boolean) => void;
  setSelectedItemId: (id: string | null) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
}
