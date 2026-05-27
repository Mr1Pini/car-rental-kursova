import type { UserRole } from "./auth";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  role?: UserRole;
  password?: string;
}
