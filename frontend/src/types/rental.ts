export type RentalStatus = "PENDING" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface RentalCarSummary {
  id: number;
  brand: string;
  model: string;
  imageName: string;
  pricePerDay: number;
}

export interface RentalUserSummary {
  id: number;
  name: string;
  email: string;
}

export interface Rental {
  id: number;
  userId: number;
  carId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: RentalStatus;
  car: RentalCarSummary;
  user: RentalUserSummary;
}
