import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";
import axios from "axios";
import { getAuthHeaders, handleError } from "../utilities/authUtilities";
import type { AddItemRequest, ClothingItem } from "../interfaces/interfaces";

// Configuration
const API_BASE_URL = 'http://localhost:5003/api';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Firebase Storage Functions
export const uploadPicsToFireBase = async (pics: File[]): Promise<string[]> => {
  const uploadPromises = pics.map(async (pic) => {
    try {
      // Validate file size
      if (pic.size > MAX_FILE_SIZE) {
        throw new Error(`File ${pic.name} exceeds maximum size of 5MB`);
      }

      // Validate file type
      if (!ALLOWED_TYPES.includes(pic.type)) {
        throw new Error(`File ${pic.name} has invalid type. Allowed types: JPEG, PNG, GIF, WebP`);
      }

      // Create unique filename
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const storageRef = ref(storage, `closet-items/${uniqueId}_${pic.name}`);

      // Upload file
      await uploadBytes(storageRef, pic);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error(`Failed to upload ${pic.name}:`, error);
      throw error;
    }
  });

  return Promise.all(uploadPromises);
};

export const uploadSinglePicToFireBase = async (pic: File): Promise<string> => {
  const urls = await uploadPicsToFireBase([pic]);
  return urls[0];
};

// API Functions
export const addClothingItem = async (data: AddItemRequest): Promise<ClothingItem> => {
  try {
    const response = await axios.post<ClothingItem>(
      `${API_BASE_URL}/clothing`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getClothingItems = async (): Promise<ClothingItem[]> => {
  try {
    const response = await axios.get<ClothingItem[]>(
      `${API_BASE_URL}/clothing`,
      { headers: getAuthHeaders() }
    );

    console.log("Clothing items fetched:", response.data.length);
    
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};



export const getClothingItemById = async (id: number): Promise<ClothingItem> => {
  try {
    const response = await axios.get<ClothingItem>(
      `${API_BASE_URL}/clothing/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateClothingItem = async (
  id: number, 
  data: Partial<AddItemRequest>
): Promise<ClothingItem> => {
  try {
    const response = await axios.put<ClothingItem>(
      `${API_BASE_URL}/clothing/${id}`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const deleteClothingItem = async (id: number): Promise<void> => {
  try {
    await axios.delete(
      `${API_BASE_URL}/clothing/${id}`,
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    throw handleError(error);
  }
};

// Validation Functions
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
  }

  return { valid: true };
};

export const validateItemData = (data: Partial<AddItemRequest>): { valid: boolean; error?: string } => {
  if (!data.name || data.name.trim() === '') {
    return { valid: false, error: 'Item name is required' };
  }

  if (!data.category || data.category.trim() === '') {
    return { valid: false, error: 'Category is required' };
  }

  if (!data.imageUrl || data.imageUrl.trim() === '') {
    return { valid: false, error: 'Image is required' };
  }

  return { valid: true };
};