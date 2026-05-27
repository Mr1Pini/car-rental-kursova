import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

const reviewInclude = {
  user: {
    select: {
      id: true,
      name: true,
    },
  },
};

const reviewIncludeWithCar = {
  ...reviewInclude,
  car: {
    select: {
      id: true,
      brand: true,
      model: true,
    },
  },
};

export class ReviewService {
  async findByCarId(carId: number) {
    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      throw new AppError(404, "Car not found");
    }

    return prisma.review.findMany({
      where: { carId },
      include: reviewInclude,
      orderBy: { createdAt: "desc" },
    });
  }

  async create(
    userId: number,
    carId: number,
    rating: number,
    comment: string,
  ) {
    if (!comment?.trim()) {
      throw new AppError(400, "Comment is required");
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new AppError(400, "Rating must be an integer between 1 and 5");
    }

    const car = await prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      throw new AppError(404, "Car not found");
    }

    return prisma.review.create({
      data: {
        userId,
        carId,
        rating,
        comment: comment.trim(),
      },
      include: reviewInclude,
    });
  }

  async findAll() {
    return prisma.review.findMany({
      include: reviewIncludeWithCar,
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteById(id: number) {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new AppError(404, "Review not found");
    }
    await prisma.review.delete({ where: { id } });
  }
}

export const reviewService = new ReviewService();

