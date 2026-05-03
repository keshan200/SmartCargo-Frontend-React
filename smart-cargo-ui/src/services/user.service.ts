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
  
  if (response.data.accessToken) {
  
    Cookies.set('userToken', response.data.accessToken, { 
      expires: 1, 
      secure: true, // HTTPS වලදී පමණක් වැඩ කරයි (Production වලදී අනිවාර්යයි)
      sameSite: 'strict', // CSRF ප්‍රහාර වලින් ආරක්ෂා වීමට
      path: '/' // මුළු ඇප් එකටම access ලැබීමට
    });
  }
  console.log("Login  cookie." ,response.data);
  return response.data;
};