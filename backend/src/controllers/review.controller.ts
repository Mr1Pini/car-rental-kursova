import { Request, Response } from "express";
import { reviewService } from "../services/review.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/errorHandler";
import { parseId } from "../utils/parseId";
import { parseBodyId } from "../utils/parseBody";

export const getReviewsByCar = asyncHandler(
  async (req: Request, res: Response) => {
    const carId = parseId(req.params.carId, "carId");
    const reviews = await reviewService.findByCarId(carId);
    res.json(reviews);
  },
);

export const createReview = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const { carId, rating, comment } = req.body;
    const review = await reviewService.create(
      req.user.id,
      parseBodyId(carId, "carId"),
      Number(rating),
      comment,
    );
    res.status(201).json(review);
  },
);
