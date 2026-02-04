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
// Types
// ----------------------------------
export interface Team {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface TeamDetails {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  createdAt: string;
  members: TeamMember[];
  projectCount: number;
  taskCount: number;
}

export interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: 'Owner' | 'Admin' | 'Member';
  joinedAt: string;
}

export interface CreateTeamData {
  name: string;
  description?: string;
  avatarUrl?: string;
}

export interface UpdateTeamData {
  name?: string;
  description?: string;
  avatarUrl?: string;
}

export interface AddMemberData {
  email: string;
  role?: 'Member' | 'Admin';
}

export interface UpdateMemberRoleData {
  role: 'Owner' | 'Admin' | 'Member';
}

// ----------------------------------
// Team Service
// ----------------------------------
export const teamService = {
  /**
   * Get all teams for the current user
   */
  getTeams: async (): Promise<Team[]> => {
    const response = await apiClient.get('/teams');
    return response.data;
  },

  /**
   * Get a single team by ID with full details
   */
  getTeam: async (teamId: string): Promise<TeamDetails> => {
    const response = await apiClient.get(`/teams/${teamId}`);
    console.log("Team details response:", response);
    return response.data;
  },

  /**
   * Create a new team
   */
  createTeam: async (data: CreateTeamData): Promise<Team> => {
    const response = await apiClient.post('/teams', data);
    return response.data;
  },

  /**
   * Update team details
   */
  updateTeam: async (teamId: string, data: UpdateTeamData): Promise<Team> => {
    const response = await apiClient.put(`/teams/${teamId}`, data);
    return response.data;
  },

  /**
   * Delete a team (soft delete)
   */
  deleteTeam: async (teamId: string): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}`);
  },

  /**
   * Add a member to the team
   */
  addMember: async (teamId: string, data: AddMemberData): Promise<void> => {
    await apiClient.post(`/teams/${teamId}/members`, data);
  },

  /**
   * Remove a member from the team
   */
  removeMember: async (teamId: string, memberId: string): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/members/${memberId}`);
  },

  /**
   * Update a member's role
   */
  updateMemberRole: async (
    teamId: string,
    memberId: string,
    data: UpdateMemberRoleData
  ): Promise<void> => {
    await apiClient.put(`/teams/${teamId}/members/${memberId}/role`, data);
  },
};

export default teamService;