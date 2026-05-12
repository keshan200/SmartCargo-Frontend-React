import Cookies from "js-cookie";
import apiClient, { BASE_URL } from "../context/apiClient";
import type { IUser, UserFormData, UserLoginCredentials } from "../types/User";



export const AUTH_URL = `${BASE_URL}/auth`



export const signup = async (userData: UserFormData): Promise<IUser> => {
  const response = await apiClient.post(`${AUTH_URL}/signup`, userData);
  return response.data;
};







export const login = async (credentials: UserLoginCredentials): Promise<{ accessToken: string; user: IUser }> => {
  const response = await apiClient.post(`${AUTH_URL}/login`, credentials);
  
  console.log(" backend Login  res." ,response.data);
  return response.data;
};


