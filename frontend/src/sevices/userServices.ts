import axios from "axios";
import type { UpdateUserData, UserData } from "../interfaces/interfaces";
import { getAuthHeaders, handleError } from "../utilities/authUtilities";

const API_BASE_URL = 'http://localhost:5003/api';


export const getUserInfo = async (): Promise<UserData> => {
  try {
    const response = await axios.get<UserData>(
      `${API_BASE_URL}/User/profile/me`,
      { headers: getAuthHeaders() }
    );
    // console.log("User Info Response:", response.data);
    
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateUserInfo = async (userData: UpdateUserData): Promise<UpdateUserData> => {
  try {
    const response = await axios.put<UpdateUserData>(
      `${API_BASE_URL}/User/update-user`,
      userData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}