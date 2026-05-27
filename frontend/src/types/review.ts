export interface Review {
  id: number;
  userId: number;
  carId: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string;
  };
}

export interface AdminReview extends Review {
  car: {
    id: number;
    brand: string;
    model: string;
  };
}
