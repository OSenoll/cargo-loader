import { create } from 'zustand';
import type { AppState, CargoItem, ContainerType, Language } from '../types';
import { CONTAINERS, getRandomColor } from '../lib/containers';

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
