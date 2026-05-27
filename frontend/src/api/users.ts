import api from "./client";
import type { AdminUser, UserUpdateInput } from "../types/user";

export async function fetchAllUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>("/api/admin/users");
  return data;
}

export async function updateUser(
  id: number,
  input: UserUpdateInput,
): Promise<AdminUser> {
  const { data } = await api.put<AdminUser>(`/api/admin/users/${id}`, input);
  return data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/api/admin/users/${id}`);
}
