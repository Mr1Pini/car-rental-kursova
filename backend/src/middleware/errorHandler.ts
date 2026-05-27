import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      res.status(404).json({ message: "Record not found" });
      return;
    }
    if (err.code === "P2002") {
      res.status(409).json({ message: "Record already exists" });
      return;
    }
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
