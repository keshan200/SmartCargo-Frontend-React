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


type Role = "CUSTOMER" | "ADMIN" | "EMPLOYEE" | "MANAGER" | "";


export interface UserFormData {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
  role: Role;
}

export interface EmployeeFormData {
  assigned_hub_id: string;
  license_number: string;
  status: "ACTIVE" | "INACTIVE";
}


export type UserLoginCredentials = Pick<IUser, 'email'> & { password: string };