import api from "./client";
import type { Car, CarFilters, CarInput } from "../types/car";

export async function fetchCars(filters: CarFilters = {}): Promise<Car[]> {
  const { data } = await api.get<Car[]>("/api/cars", { params: filters });
  return data;
}

export async function fetchCarById(id: number): Promise<Car> {
  const { data } = await api.get<Car>(`/api/cars/${id}`);
  return data;
}

export async function createCar(input: CarInput): Promise<Car> {
  const { data } = await api.post<Car>("/api/cars", input);
  return data;
}

export async function updateCar(
  id: number,
  input: Partial<CarInput>,
): Promise<Car> {
  const { data } = await api.put<Car>(`/api/cars/${id}`, input);
  return data;
}

export async function deleteCar(id: number): Promise<void> {
  await api.delete(`/api/cars/${id}`);
}
