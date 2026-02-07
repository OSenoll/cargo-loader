import { create } from 'zustand';
import type { AppState, CargoItem, ContainerType, Language } from '../types';
import { CONTAINERS, getRandomColor, calculateVolume } from '../lib/containers';

const STORAGE_KEY = 'cargo-loader-data';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const useStore = create<AppState>((set, get) => ({
  // Baslangic degerleri
  language: 'en' as Language, // English default
  selectedContainer: CONTAINERS[2], // 40ft HC default
  containers: CONTAINERS,
  items: [],
  packingResult: null,
  isPacking: false,
  selectedItemId: null,
  isManualEditMode: false,
  isManualPlaceMode: false,
  draggingItemIndex: null,

  // Dil degistirme
  setLanguage: (language: Language) => {
    set({ language });
    get().saveToStorage();
  },

  // Container secimi
  setSelectedContainer: (container: ContainerType) => {
    set({ selectedContainer: container, packingResult: null });
    get().saveToStorage();
  },

  // Esya ekleme
  addItem: (item) => {
    const newItem: CargoItem = {
      ...item,
      id: generateId(),
      color: getRandomColor()
    };
    set((state) => ({
      items: [...state.items, newItem],
      packingResult: null
    }));
    get().saveToStorage();
  },

  // Esya guncelleme
  updateItem: (id, updates) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
      packingResult: null
    }));
    get().saveToStorage();
  },

  // Esya silme
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
      packingResult: null
    }));
    get().saveToStorage();
  },

  // Tum esyalari temizle
  clearItems: () => {
    set({ items: [], packingResult: null });
    get().saveToStorage();
  },

  // Packing sonucu
  setPackingResult: (result) => set({ packingResult: result }),

  // Packing durumu
  setIsPacking: (isPacking) => set({ isPacking }),

  // Secili esya
  setSelectedItemId: (id) => set({ selectedItemId: id }),

  // Manuel mod
  setIsManualEditMode: (enabled) => set({ isManualEditMode: enabled }),
  setIsManualPlaceMode: (enabled) => set({ isManualPlaceMode: enabled }),
  setDraggingItemIndex: (index) => set({ draggingItemIndex: index }),

  // Packed item pozisyonunu guncelle
  updatePackedItemPosition: (index, position) => {
    const state = get();
    if (!state.packingResult) return;

    const packedItems = [...state.packingResult.packedItems];
    if (index < 0 || index >= packedItems.length) return;

    packedItems[index] = {
      ...packedItems[index],
      position: { ...position }
    };

    // Istatistikleri yeniden hesapla
    const container = state.selectedContainer;
    const totalVolume = calculateVolume(container.length, container.width, container.height);
    const usedVolume = packedItems.reduce(
      (acc, pi) => acc + calculateVolume(pi.dimensions.width, pi.dimensions.height, pi.dimensions.depth),
      0
    );
    const totalWeight = packedItems.reduce((acc, pi) => acc + pi.item.weight, 0);

    set({
      packingResult: {
        ...state.packingResult,
        packedItems,
        volumeUtilization: (usedVolume / totalVolume) * 100,
        weightUtilization: (totalWeight / container.maxWeight) * 100,
        usedVolume,
        totalVolume,
        totalWeight
      }
    });
  },

  // Manuel yerlesim: esyayi konteynere ekle
  addManualItem: (item) => {
    const state = get();
    const container = state.selectedContainer;

    const newPackedItem = {
      item,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      dimensions: {
        width: item.length,
        height: item.height,
        depth: item.width
      }
    };

    const currentResult = state.packingResult || {
      packedItems: [],
      unpackedItems: [],
      volumeUtilization: 0,
      weightUtilization: 0,
      totalVolume: calculateVolume(container.length, container.width, container.height),
      usedVolume: 0,
      totalWeight: 0
    };

    const packedItems = [...currentResult.packedItems, newPackedItem];
    const usedVolume = packedItems.reduce(
      (acc, pi) => acc + calculateVolume(pi.dimensions.width, pi.dimensions.height, pi.dimensions.depth),
      0
    );
    const totalWeight = packedItems.reduce((acc, pi) => acc + pi.item.weight, 0);
    const totalVolume = calculateVolume(container.length, container.width, container.height);

    set({
      packingResult: {
        ...currentResult,
        packedItems,
        volumeUtilization: (usedVolume / totalVolume) * 100,
        weightUtilization: (totalWeight / container.maxWeight) * 100,
        usedVolume,
        totalVolume,
        totalWeight
      }
    });
  },

  // Packed item'i kaldir
  removePackedItem: (index) => {
    const state = get();
    if (!state.packingResult) return;

    const removed = state.packingResult.packedItems[index];
    if (!removed) return;

    const packedItems = state.packingResult.packedItems.filter((_, i) => i !== index);
    const container = state.selectedContainer;
    const totalVolume = calculateVolume(container.length, container.width, container.height);
    const usedVolume = packedItems.reduce(
      (acc, pi) => acc + calculateVolume(pi.dimensions.width, pi.dimensions.height, pi.dimensions.depth),
      0
    );
    const totalWeight = packedItems.reduce((acc, pi) => acc + pi.item.weight, 0);

    set({
      packingResult: {
        ...state.packingResult,
        packedItems,
        unpackedItems: [...state.packingResult.unpackedItems, removed.item],
        volumeUtilization: (usedVolume / totalVolume) * 100,
        weightUtilization: (totalWeight / container.maxWeight) * 100,
        usedVolume,
        totalVolume,
        totalWeight
      }
    });
  },

  // localStorage'dan yukle
  loadFromStorage: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const container = CONTAINERS.find(c => c.id === parsed.containerId) || CONTAINERS[2];
        set({
          language: parsed.language || 'en',
          selectedContainer: container,
          items: parsed.items || []
        });
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  },

  // localStorage'a kaydet
  saveToStorage: () => {
    try {
      const state = get();
      const data = {
        language: state.language,
        containerId: state.selectedContainer.id,
        items: state.items
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }
}));
