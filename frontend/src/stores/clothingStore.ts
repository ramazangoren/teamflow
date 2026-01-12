// stores/clothingStore.ts
import { create } from 'zustand';
import { getClothingItems } from '../sevices/ItemServices';
import type { ClothingItem } from '../interfaces/interfaces';

interface ClothingStore {
  items: ClothingItem[];
  itemLength: number;
  updateItemLength: () => Promise<void>;
}

export const useClothingStore = create<ClothingStore>((set) => ({
  items: [],
  itemLength: 0,
  updateItemLength: async () => {
    const items = await getClothingItems();
    set({ 
      items,
      itemLength: items.length 
    });
  },
}));