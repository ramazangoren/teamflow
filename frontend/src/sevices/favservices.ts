// import axios from "axios";
// import type { AddFavRequest, ClothingItem } from "../interfaces/interfaces";
// import { getAuthHeaders, handleError } from "../utilities/authUtilities";

// const API_BASE_URL = 'http://localhost:5003/api';

import axios from 'axios';
import { type ClothingItem, type AddFavRequest, type FavoriteResponse } from '../interfaces/interfaces';

const API_BASE_URL = 'http://localhost:5003/api';

// Helper function to get auth headers (assuming you have this)
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); // or however you store your token
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Helper function to handle errors (assuming you have this)
const handleError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message || error.message;
    return new Error(message);
  }
  return error instanceof Error ? error : new Error('An unknown error occurred');
};

export const addFavClothingItem = async (clothingItemId: number): Promise<FavoriteResponse> => {
  try {
    const response = await axios.post<FavoriteResponse>(
      `${API_BASE_URL}/favorites`,
      { clothingItemId }, // Now correctly typed as number
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getFavClothingItems = async (): Promise<ClothingItem[]> => {
  try {
    const response = await axios.get<ClothingItem[]>(
      `${API_BASE_URL}/favorites`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const removeFavClothingItem = async (clothingItemId: number): Promise<void> => {
  try {
    await axios.delete(
      `${API_BASE_URL}/favorites/${clothingItemId}`,
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    throw handleError(error);
  }
};