export const UserRole = {
  ADMIN: 'ADMIN',
  DISPATCHER: 'DISPATCHER',
  DRIVER: 'DRIVER',
  CUSTOMER: 'CUSTOMER',
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

export interface IUser {
  _id: string;               
  email: string;
  role: UserRoleType; 
  createdAt: string;         
  updatedAt: string;

  hub?: {
    lat: number;
    lng: number;
  };
}

export interface IUserSignup extends Omit<IUser, '_id' | 'createdAt' | 'updatedAt'> {
  password: string;          
}


type Role = "CUSTOMER" | "ADMIN" | "EMPLOYEE" | "MANAGER" | "";


export interface UserFormData {
  email: string;
  password: string;
  role: Role;
}

export interface EmployeeFormData {
  full_name: string;
  mobile_number: string;
  address: string;
  employee_type: "DRIVER" | "DISPATCHER" | ""; 
  assigned_hub_id: string;
  license_number: string;
  status: "ACTIVE" | "INACTIVE";
}

export type UserLoginCredentials = Pick<IUser, 'email'> & { password: string };