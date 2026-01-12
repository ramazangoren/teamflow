import axios from "axios";
import { getAuthHeaders, handleError } from "../utilities/authUtilities";
import type { 
  SaveOutfitRequest,
  SavedOutfitResponse,
  OutfitDetails
} from "../interfaces/interfaces";

// Configuration
const API_BASE_URL = 'http://localhost:5003/api';

// Save complete outfit with all items
export const saveCompleteOutfit = async (data: SaveOutfitRequest): Promise<SavedOutfitResponse> => {
  try {
    const response = await axios.post<SavedOutfitResponse>(
      `${API_BASE_URL}/outfits`,
      data,
      { headers: getAuthHeaders() }
    );

    console.log(response.data);
    
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Get all saved outfits for the current user
export const getSavedOutfits = async (): Promise<OutfitDetails[]> => {
  try {
    const response = await axios.get<OutfitDetails[]>(
      `${API_BASE_URL}/outfits`,
      { headers: getAuthHeaders() }
    );

    console.log('response.data', response.data);
    
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Get a specific outfit by ID
export const getOutfitById = async (outfitId: number): Promise<OutfitDetails> => {
  try {
    const response = await axios.get<OutfitDetails>(
      `${API_BASE_URL}/outfits/${outfitId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Delete a saved outfit
export const deleteOutfit = async (outfitId: number): Promise<void> => {
  try {
    await axios.delete(
      `${API_BASE_URL}/outfits/${outfitId}`,
      { headers: getAuthHeaders() }
    );
  } catch (error) {
    throw handleError(error);
  }
};

// Update outfit details (occasion, weather)
export const updateOutfit = async (
  outfitId: number, 
  data: Partial<SaveOutfitRequest>
): Promise<SavedOutfitResponse> => {
  try {
    const response = await axios.put<SavedOutfitResponse>(
      `${API_BASE_URL}/outfits/${outfitId}`,
      data,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};