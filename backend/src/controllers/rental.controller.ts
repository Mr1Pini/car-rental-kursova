import { RentalStatus } from "@prisma/client";
import { Request, Response } from "express";
import { rentalService } from "../services/rental.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/errorHandler";
import { parseId } from "../utils/parseId";
import { parseBodyId } from "../utils/parseBody";

export const createRental = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const { carId, startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      throw new AppError(400, "startDate and endDate are required");
    }

    const rental = await rentalService.create(
      req.user.id,
      parseBodyId(carId, "carId"),
      startDate,
      endDate,
    );
    res.status(201).json(rental);
  },
);

export const getMyRentals = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(401, "Authentication required");
    }

    const rentals = await rentalService.findByUser(req.user.id);
    res.json(rentals);
  },
);

export const getAllRentals = asyncHandler(
  async (_req: Request, res: Response) => {
    const rentals = await rentalService.findAll();
    res.json(rentals);
  },
);

export const updateRentalStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const id = parseId(req.params.id);
    const { status } = req.body;

    if (!status || !Object.values(RentalStatus).includes(status)) {
      throw new AppError(400, "Invalid rental status");
    }

    const rental = await rentalService.updateStatus(id, status as RentalStatus);
    res.json(rental);
  },
);
