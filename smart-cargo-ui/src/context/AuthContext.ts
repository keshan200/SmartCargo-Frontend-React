import { createContext } from "react";
import type { IUser } from "../types/User";


export interface AuthContextType {
  isLoggedIn: boolean;
  isAuthenticating: boolean;
  user: IUser | null; 
  login: (accessToken: string) => void;
  logout: () => void;
  setUser: (user: IUser | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);