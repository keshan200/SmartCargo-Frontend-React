// src/types/user.ts

export const UserRole = {
  ADMIN: 'ADMIN',
  DISPATCHER: 'DISPATCHER',
  DRIVER: 'DRIVER',
  CUSTOMER: 'CUSTOMER',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export interface IUser {
  _id: string;               
  full_name: string;
  email: string;
  phone_number: string;
  role: UserRoleType; 
  createdAt: string;         
  updatedAt: string;
}

export interface IUserSignup extends Omit<IUser, '_id' | 'createdAt' | 'updatedAt'> {
  password: string;          
}

export type UserLoginCredentials = Pick<IUser, 'email'> & { password: string };