import apiClient, { BASE_URL } from "../context/apiClient";
import type { IUser, UserFormData, UserLoginCredentials } from "../types/User";



export const AUTH_URL = `${BASE_URL}/auth`



export const signup = async (userData: UserFormData): Promise<IUser> => {
  const response = await apiClient.post(`${AUTH_URL}/signup`, userData);
  return response.data;
};




export const login = async (credentials: UserLoginCredentials): Promise<{ access_token: string; user: IUser }> => {
  const response = await apiClient.post(`${AUTH_URL}/login`, credentials);
  
  if (response.data.access_token) {
    localStorage.setItem('userToken', response.data.access_token);
  }
  
  return response.data;
};