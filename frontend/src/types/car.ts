export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  isAvailable: boolean;
  imageName: string;
  description: string;
}

export interface CarInput {
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  isAvailable?: boolean;
  imageName: string;
  description: string;
}

export type CarSortBy = "price_asc" | "price_desc" | "year_desc";

export interface CarFilters {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  sortBy?: CarSortBy;
}

export const CAR_SORT_OPTIONS: { value: CarSortBy; label: string }[] = [
  { value: "price_asc", label: "Спочатку дешевші" },
  { value: "price_desc", label: "Спочатку дорожчі" },
  { value: "year_desc", label: "За новинкою" },
];
