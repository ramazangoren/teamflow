import axios from 'axios';
import { clearUserData, getAuthHeaders, handleError, saveUserData } from '../utilities/authUtilities';
import type { AuthResponse, LoginRequest, RegisterRequest} from '../interfaces/interfaces';

const API_BASE_URL = 'http://localhost:5003/api';


export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/Auth/register`,
      data,
      { headers: getAuthHeaders() }
    );
    saveUserData(response.data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(
      `${API_BASE_URL}/Auth/login`,
      data,
      { headers: getAuthHeaders() }
    );
    saveUserData(response.data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const logout = (): void => {
  clearUserData();
};

const authService = {
  register,
  login,
  logout,
};

export default authService;