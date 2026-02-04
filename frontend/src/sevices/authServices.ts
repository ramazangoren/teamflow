import axios from "axios";

const API_BASE_URL = "http://localhost:5003/api";

// ----------------------------------
// Axios instance
// ----------------------------------
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // REQUIRED for HttpOnly cookies
});

// ----------------------------------
// Response interceptor (401 handling + auto refresh)
// ----------------------------------
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, try to refresh the access token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint - this will set a new accessToken cookie
        await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry the original request with the new accessToken cookie
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For other errors or if refresh already failed, reject
    return Promise.reject(error);
  }
);

// ----------------------------------
// Types
// ----------------------------------
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

export interface CurrentUser {
  id: string;
  name: string; // Note: backend returns 'name', not 'fullName'
  email: string;
  avatar?: string;
  currentTeam?: {
    id: string;
    name: string;
  };
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  currentTeam?: {
    id: string;
    name: string;
  };
}

// ----------------------------------
// Auth service (COOKIE BASED - both tokens)
// ----------------------------------
export const authService = {
  login: async (data: LoginData) => {
    // Backend sets accessToken and refreshToken cookies automatically
    await apiClient.post("/auth/login", data);
  },

  register: async (data: RegisterData) => {
    // Backend sets accessToken and refreshToken cookies automatically
    await apiClient.post("/auth/register", data);
  },

  logout: async () => {
    // Backend deletes both cookies
    await apiClient.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<CurrentUser> => {
    // accessToken cookie is automatically sent with the request
    const res = await apiClient.get("/auth/me");
    return res.data;
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      // If accessToken cookie is valid, this will succeed
      await apiClient.get("/auth/me");
      return true;
    } catch {
      return false;
    }
  },
};

export default authService;