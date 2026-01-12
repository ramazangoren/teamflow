export interface ClothingItem {
  id: number;
  name: string;
  category: string;
  color: string;
  pattern: string;
  season: string;
  imageUrl: string;
  style: string;
}

export interface AddItemRequest {
  name: string;
  category: string;
  color: string;
  pattern: string;
  season: string;
  imageUrl: string;
  style: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}


export interface RegisterRequest {
  email: string;
  password: string;
  FullName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: number;
  email: string;
  FullName: string;
  token: string;
}

export interface UserData {
  userId: string | null;
  email: string | null;
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  createdAt: string;
}
export interface UpdateUserData {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  updatedAt: string;
}


export interface AddFavRequest {
  clothingItemId: number;
}

// ✅ Added: Response interface for adding favorites
export interface FavoriteResponse {
  id: number;
  userId: number;
  clothingItemId: number;
}


// Outfit Interfaces

// Request to save a complete outfit
export interface SaveOutfitRequest {
  topId: number;
  bottomId: number;
  shoesId: number;
  accessoryId?: number | null;
  outwearId?: number | null;
  hatsId?: number | null;
  occasion: string;
  weather: string;
}

// Response when outfit is saved
export interface SavedOutfitResponse {
  id: number;
  userId: number;
  topId: number;
  bottomId: number;
  shoesId: number;
  accessoryId?: number | null;
  outwearId: number | null;
  hatsId: number | null;
  occasion: string;
  weather: string;
  createdAt: string;
}

// Full outfit details with populated clothing items
export interface OutfitDetails {
  id: number;
  userId: number;
  occasion: string;
  weather: string;
  createdAt: string;
  top: {
    id: number;
    name: string;
    category: string;
    imageUrl?: string;
  };
  bottom: {
    id: number;
    name: string;
    category: string;
    imageUrl?: string;
  };
  shoes: {
    id: number;
    name: string;
    category: string;
    imageUrl?: string;
  };
  accessory?: {
    id: number;
    name: string;
    category: string;
    imageUrl?: string;
  };
  outerwear: {
    id: number;
    name: string;
    category: string;
    imageUrl?: string;
  };
  hats: {
    id: number;
    name: string;
    category: string;
    imageUrl?: string;
  };
}


export interface OutfitItem {
  id: number;
  name: string;
  emoji: string;
  imageUrl?: string;
}

export interface Outfit {
  id: number;
  top: OutfitItem;
  bottom: OutfitItem;
  shoes: OutfitItem;
  accessory?: OutfitItem;
  occasion: string;
  weather: string;
  liked: boolean;
  outerwear: OutfitItem;
  hats: OutfitItem;
}
