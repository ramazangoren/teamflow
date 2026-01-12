import axios, { AxiosError } from "axios";
import type { AuthResponse } from "../interfaces/interfaces";

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'accept': 'text/plain',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const handleError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const message = (axiosError.response.data as any)?.message || 
                     axiosError.response.data || 
                     'An error occurred';
      return new Error(message as string);
    } else if (axiosError.request) {
      return new Error('No response from server. Please check your connection.');
    }
  }
  return new Error('An unexpected error occurred');
};


export const saveUserData = (data: AuthResponse): void => {
  localStorage.setItem('token', data.token);
};

export const clearUserData = (): void => {
  localStorage.removeItem('token');
};