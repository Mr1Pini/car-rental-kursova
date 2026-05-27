import api from "./client";
import type { Rental, RentalStatus } from "../types/rental";

export async function createRental(
  carId: number,
  startDate: string,
  endDate: string,
): Promise<Rental> {
  const { data } = await api.post<Rental>("/api/rentals", {
    carId,
    startDate: new Date(startDate).toISOString(),
    endDate: new Date(endDate).toISOString(),
  });
  return data;
}

export async function fetchMyRentals(): Promise<Rental[]> {
  const { data } = await api.get<Rental[]>("/api/rentals/my");
  return data;
}

export async function fetchAllRentals(): Promise<Rental[]> {
  const { data } = await api.get<Rental[]>("/api/rentals");
  return data;
}

export async function updateRentalStatus(
  id: number,
  status: RentalStatus,
): Promise<Rental> {
  const { data } = await api.patch<Rental>(`/api/rentals/${id}/status`, {
    status,
  });
  return data;
}
