import api from "./client";
import type { AdminAnalytics, AdminStats } from "../types/admin";

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await api.get<AdminStats>("/api/admin/stats");
  return data;
}

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  const { data } = await api.get<AdminAnalytics>("/api/admin/analytics");
  return data;
}
