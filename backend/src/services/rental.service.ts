import { RentalStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import {
  calculateTotalPrice,
  parseDate,
} from "../utils/rentalPrice";

const rentalInclude = {
  car: {
    select: {
      id: true,
      brand: true,
      model: true,
      imageName: true,
      pricePerDay: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

export class RentalService {
  async create(userId: number, carId: number, startDateStr: string, endDateStr: string) {
    const startDate = parseDate(startDateStr, "startDate");
    const endDate = parseDate(endDateStr, "endDate");

    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      throw new AppError(404, "Car not found");
    }

    if (!car.isAvailable) {
      throw new AppError(400, "Car is not available for rental");
    }

    const overlapping = await prisma.rental.findFirst({
      where: {
        carId,
        status: { in: [RentalStatus.PENDING, RentalStatus.ACTIVE] },
        startDate: { lte: endDate },
        endDate: { gte: startDate },
      },
    });

    if (overlapping) {
      throw new AppError(400, "Car is already booked for selected dates");
    }

    const totalPrice = calculateTotalPrice(
      car.pricePerDay,
      startDate,
      endDate,
    );

    return prisma.rental.create({
      data: {
        userId,
        carId,
        startDate,
        endDate,
        totalPrice,
        status: RentalStatus.PENDING,
      },
      include: rentalInclude,
    });
  }

  async findByUser(userId: number) {
    return prisma.rental.findMany({
      where: { userId },
      include: rentalInclude,
      orderBy: { startDate: "desc" },
    });
  }

  async findAll() {
    return prisma.rental.findMany({
      include: rentalInclude,
      orderBy: { startDate: "desc" },
    });
  }

  async updateStatus(id: number, status: RentalStatus) {
    const rental = await prisma.rental.findUnique({ where: { id } });
    if (!rental) {
      throw new AppError(404, "Rental not found");
    }

    if (!Object.values(RentalStatus).includes(status)) {
      throw new AppError(400, "Invalid rental status");
    }

    return prisma.rental.update({
      where: { id },
      data: { status },
      include: rentalInclude,
    });
  }
}

export const rentalService = new RentalService();
