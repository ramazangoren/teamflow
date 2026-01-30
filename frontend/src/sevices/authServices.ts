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
// Response interceptor (401 handling)
// ----------------------------------
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    // If backend refresh fails, user is logged out
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
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
  fullName: string;
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
// Auth service (COOKIE BASED)
// ----------------------------------
export const authService = {
  login: async (data: LoginData) => {
    await apiClient.post("/auth/login", data);
  },

  register: async (data: RegisterData) => {
    await apiClient.post("/auth/register", data);
  },

  logout: async () => {
    await apiClient.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<CurrentUser> => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      await apiClient.get("/auth/me");
      return true;
    } catch {
      return false;
    }
  },
};

export default authService;
