import api from "./client";
import type { AdminReview, Review } from "../types/review";

export async function fetchReviewsByCar(carId: number): Promise<Review[]> {
  const { data } = await api.get<Review[]>(`/api/reviews/car/${carId}`);
  return data;
}

export async function fetchAllReviewsAdmin(): Promise<AdminReview[]> {
  const { data } = await api.get<AdminReview[]>("/api/admin/reviews");
  return data;
}

export async function deleteReviewAdmin(id: number): Promise<void> {
  await api.delete(`/api/admin/reviews/${id}`);
}

export async function createReview(
  carId: number,
  rating: number,
  comment: string,
): Promise<Review> {
  const { data } = await api.post<Review>("/api/reviews", {
    carId,
    rating,
    comment,
  });
  return data;
}
