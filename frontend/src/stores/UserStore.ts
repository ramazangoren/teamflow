import { create } from 'zustand';
import type { UserData, UpdateUserData } from '../interfaces/interfaces';
import { getUserInfo, updateUserInfo } from '../sevices/userServices';

interface UserStore {
  userInformation: UserData | null;
  loading: boolean;
  error: string | null;
  loadUserInfo: () => Promise<void>;
  updateUserData: (data: UpdateUserData) => Promise<void>;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInformation: null,
  loading: false,
  error: null,

  loadUserInfo: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getUserInfo();
      // getUserInfo returns an array, take the first element
      const userData = Array.isArray(response) ? response[0] : response;
      set({ userInformation: userData, loading: false });
    } catch (error) {
      console.error('Error loading user info:', error);
      set({ 
        error: 'Failed to load profile information. Please try again.',
        loading: false 
      });
    }
  },

  updateUserData: async (data: UpdateUserData) => {
    try {
      const dataToUpdate = {
        ...data,
        updatedAt: new Date().toISOString()
      };

      await updateUserInfo(dataToUpdate);
      
      // Update the store with new data
      const currentUser = get().userInformation;
      if (currentUser) {
        set({
          userInformation: {
            ...currentUser,
            fullName: dataToUpdate.fullName,
            phoneNumber: dataToUpdate.phoneNumber,
            dateOfBirth: dataToUpdate.dateOfBirth,
            gender: dataToUpdate.gender,
          }
        });
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      throw error; // Re-throw to handle in component
    }
  },

  clearError: () => set({ error: null }),
}));