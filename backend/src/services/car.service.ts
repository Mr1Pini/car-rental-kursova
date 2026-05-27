import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

export type CarSortBy = "price_asc" | "price_desc" | "year_desc";

export interface CarFilters {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  sortBy?: CarSortBy;
}

const VALID_SORT: CarSortBy[] = ["price_asc", "price_desc", "year_desc"];

export function parseCarSortBy(value: unknown): CarSortBy | undefined {
  if (typeof value !== "string" || !VALID_SORT.includes(value as CarSortBy)) {
    return undefined;
  }
  return value as CarSortBy;
}

function resolveOrderBy(sortBy?: CarSortBy): Prisma.CarOrderByWithRelationInput {
  switch (sortBy) {
    case "price_asc":
      return { pricePerDay: "asc" };
    case "price_desc":
      return { pricePerDay: "desc" };
    case "year_desc":
      return { year: "desc" };
    default:
      return { id: "asc" };
  }
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

export class CarService {
  async findAll(filters: CarFilters = {}) {
    const where: Prisma.CarWhereInput = {};

    if (filters.brand) {
      where.brand = { contains: filters.brand };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.pricePerDay = {};
      if (filters.minPrice !== undefined) {
        where.pricePerDay.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.pricePerDay.lte = filters.maxPrice;
      }
    }

    if (filters.isAvailable !== undefined) {
      where.isAvailable = filters.isAvailable;
    }

    return prisma.car.findMany({
      where,
      orderBy: resolveOrderBy(filters.sortBy),
    });
  }

  async findById(id: number) {
    const car = await prisma.car.findUnique({ where: { id } });
    if (!car) {
      throw new AppError(404, "Car not found");
    }
    return car;
  }

  async create(data: CarInput) {
    this.validateCarInput(data);

    return prisma.car.create({
      data: {
        brand: data.brand.trim(),
        model: data.model.trim(),
        year: data.year,
        pricePerDay: data.pricePerDay,
        isAvailable: data.isAvailable ?? true,
        imageName: data.imageName.trim(),
        description: data.description.trim(),
      },
    });
  }

  async update(id: number, data: Partial<CarInput>) {
    await this.findById(id);

    if (Object.keys(data).length === 0) {
      throw new AppError(400, "No fields to update");
    }

    if (data.year !== undefined && data.year < 1900) {
      throw new AppError(400, "Invalid year");
    }

    if (data.pricePerDay !== undefined && data.pricePerDay <= 0) {
      throw new AppError(400, "pricePerDay must be positive");
    }

    return prisma.car.update({
      where: { id },
      data: {
        ...(data.brand !== undefined && { brand: data.brand.trim() }),
        ...(data.model !== undefined && { model: data.model.trim() }),
        ...(data.year !== undefined && { year: data.year }),
        ...(data.pricePerDay !== undefined && {
          pricePerDay: data.pricePerDay,
        }),
        ...(data.isAvailable !== undefined && {
          isAvailable: data.isAvailable,
        }),
        ...(data.imageName !== undefined && {
          imageName: data.imageName.trim(),
        }),
        ...(data.description !== undefined && {
          description: data.description.trim(),
        }),
      },
    });
  }

  async delete(id: number) {
    await this.findById(id);
    await prisma.car.delete({ where: { id } });
  }

  private validateCarInput(data: CarInput) {
    if (
      !data.brand?.trim() ||
      !data.model?.trim() ||
      !data.imageName?.trim() ||
      !data.description?.trim()
    ) {
      throw new AppError(
        400,
        "brand, model, imageName and description are required",
      );
    }

    if (!data.year || data.year < 1900) {
      throw new AppError(400, "Valid year is required");
    }

    if (!data.pricePerDay || data.pricePerDay <= 0) {
      throw new AppError(400, "pricePerDay must be positive");
    }
  }
}

export const carService = new CarService();
