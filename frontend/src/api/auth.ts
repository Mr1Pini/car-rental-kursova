import api from "./client";
import type { AuthResponse, User } from "../types/auth";

export async function loginRequest(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/login", {
    email,
    password,
  });
  return data;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/api/auth/register", {
    name,
    email,
    password,
  });
  return data;
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>("/api/auth/me");
  return data;
}
