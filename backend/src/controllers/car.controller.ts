import { Request, Response } from "express";
import { carService, parseCarSortBy } from "../services/car.service";
import { asyncHandler } from "../utils/asyncHandler";
import { parseId } from "../utils/parseId";

function parseOptionalFloat(value: unknown): number | undefined {
  if (value === undefined || value === "") return undefined;
  const num = Number(value);
  return Number.isNaN(num) ? undefined : num;
}

function parseOptionalBoolean(value: unknown): boolean | undefined {
  if (value === undefined || value === "") return undefined;
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;
  return undefined;
}

export const getCars = asyncHandler(async (req: Request, res: Response) => {
  const cars = await carService.findAll({
    brand: req.query.brand as string | undefined,
    minPrice: parseOptionalFloat(req.query.minPrice),
    maxPrice: parseOptionalFloat(req.query.maxPrice),
    isAvailable: parseOptionalBoolean(req.query.isAvailable),
    sortBy: parseCarSortBy(req.query.sortBy),
  });
  res.json(cars);
});

export const getCarById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const car = await carService.findById(id);
  res.json(car);
});

export const createCar = asyncHandler(async (req: Request, res: Response) => {
  const car = await carService.create(req.body);
  res.status(201).json(car);
});

export const updateCar = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const car = await carService.update(id, req.body);
  res.json(car);
});

export const deleteCar = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  await carService.delete(id);
  res.status(204).send();
});
