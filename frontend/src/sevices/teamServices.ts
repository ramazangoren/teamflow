import axios from "axios";

export interface CreateTeamPayload {
  name: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  memberCount: number;
  projectCount: number;
  createdAt: string;
}


const api = axios.create({
  baseURL: "http://localhost:5003/api",
  headers: {
    "Content-Type": "application/json",
    accept: "*/*",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const teamService = {
  createTeam: async (payload: CreateTeamPayload): Promise<Team> => {
    const { data } = await api.post("/teams", payload);
    return data;
  },
};


