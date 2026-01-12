import { create } from 'zustand';
import type {
  OutfitDetails,
  SaveOutfitRequest,
  SavedOutfitResponse,
} from '../interfaces/interfaces';
import {
  getSavedOutfits,
  saveCompleteOutfit,
  getOutfitById,
  deleteOutfit,
  updateOutfit,
} from '../sevices/OutfitServices';

interface OutfitStore {
  // State
  savedOutfits: OutfitDetails[];
  currentOutfit: OutfitDetails | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Actions
  loadSavedOutfits: () => Promise<void>;
  saveOutfit: (data: SaveOutfitRequest) => Promise<SavedOutfitResponse>;
  loadOutfitById: (outfitId: number) => Promise<void>;
  removeOutfit: (outfitId: number) => Promise<void>;
  updateOutfitDetails: (outfitId: number, data: Partial<SaveOutfitRequest>) => Promise<void>;
  checkIfOutfitSaved: (outfit: {
    topId: number;
    bottomId: number;
    shoesId: number;
    accessoryId?: number | null;
    outwearId?: number | null;
    hatsId?: number | null;
  }) => boolean;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  savedOutfits: [],
  currentOutfit: null,
  isLoading: false,
  isSaving: false,
  error: null,
};

export const useOutfitStore = create<OutfitStore>((set, get) => ({
  ...initialState,

  // Load all saved outfits
  loadSavedOutfits: async () => {
    set({ isLoading: true, error: null });
    try {
      const outfits = await getSavedOutfits();
      set({ savedOutfits: outfits, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load saved outfits';
      set({ error: errorMessage, isLoading: false });
      console.error('Error loading saved outfits:', error);
    }
  },

  // Save a new outfit
  saveOutfit: async (data: SaveOutfitRequest) => {
    set({ isSaving: true, error: null });
    try {
      const response = await saveCompleteOutfit(data);
      
      // Reload saved outfits to get the complete data
      await get().loadSavedOutfits();
      
      set({ isSaving: false });
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save outfit';
      set({ error: errorMessage, isSaving: false });
      console.error('Error saving outfit:', error);
      throw error;
    }
  },

  // Load a specific outfit by ID
  loadOutfitById: async (outfitId: number) => {
    set({ isLoading: true, error: null });
    try {
      const outfit = await getOutfitById(outfitId);
      set({ currentOutfit: outfit, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load outfit';
      set({ error: errorMessage, isLoading: false, currentOutfit: null });
      console.error('Error loading outfit:', error);
    }
  },

  // Delete an outfit
  removeOutfit: async (outfitId: number) => {
    set({ isLoading: true, error: null });
    try {
      await deleteOutfit(outfitId);
      
      // Remove from local state
      set(state => ({
        savedOutfits: state.savedOutfits.filter(outfit => outfit.id !== outfitId),
        currentOutfit: state.currentOutfit?.id === outfitId ? null : state.currentOutfit,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete outfit';
      set({ error: errorMessage, isLoading: false });
      console.error('Error deleting outfit:', error);
      throw error;
    }
  },

  // Update outfit details
  updateOutfitDetails: async (outfitId: number, data: Partial<SaveOutfitRequest>) => {
    set({ isSaving: true, error: null });
    try {
      await updateOutfit(outfitId, data);
      
      // Reload saved outfits to get updated data
      await get().loadSavedOutfits();
      
      // Update current outfit if it's the one being modified
      if (get().currentOutfit?.id === outfitId) {
        await get().loadOutfitById(outfitId);
      }
      
      set({ isSaving: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update outfit';
      set({ error: errorMessage, isSaving: false });
      console.error('Error updating outfit:', error);
      throw error;
    }
  },

  // Check if an outfit is already saved
  checkIfOutfitSaved: (outfit) => {
    const { savedOutfits } = get();
    return savedOutfits.some(saved => 
      saved.top.id === outfit.topId &&
      saved.bottom.id === outfit.bottomId &&
      saved.shoes.id === outfit.shoesId &&
      (outfit.accessoryId === null || outfit.accessoryId === undefined || saved.accessory?.id === outfit.accessoryId) &&
      (outfit.outwearId === null || outfit.outwearId === undefined || saved.outerwear?.id === outfit.outwearId) &&
      (outfit.hatsId === null || outfit.hatsId === undefined || saved.hats?.id === outfit.hatsId)
    );
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store to initial state
  reset: () => set(initialState),
}));