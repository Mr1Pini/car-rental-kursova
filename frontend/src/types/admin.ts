export interface AdminStats {
  totalClients: number;
  totalCars: number;
  totalRevenue: number;
}

export interface MonthlyRevenue {
  month: string;
  label: string;
  revenue: number;
}

export interface PopularCar {
  id: number;
  brand: string;
  model: string;
  label: string;
  rentalCount: number;
}

export interface AdminAnalytics {
  monthlyRevenue: MonthlyRevenue[];
  topCars: PopularCar[];
}
