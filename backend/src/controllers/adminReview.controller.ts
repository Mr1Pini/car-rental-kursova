import { Request, Response } from "express";
import { reviewService } from "../services/review.service";
import { asyncHandler } from "../utils/asyncHandler";
import { parseId } from "../utils/parseId";

export const getAllReviews = asyncHandler(
  async (_req: Request, res: Response) => {
    const reviews = await reviewService.findAll();
    res.json(reviews);
  },
);

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  await reviewService.deleteById(id);
  res.status(204).send();
});
