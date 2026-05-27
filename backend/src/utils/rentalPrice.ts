import { AppError } from "../middleware/errorHandler";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function parseDate(value: string, fieldName: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(400, `Invalid ${fieldName} date`);
  }
  return date;
}

export function calculateRentalDays(startDate: Date, endDate: Date): number {
  if (endDate <= startDate) {
    throw new AppError(400, "endDate must be after startDate");
  }

  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / MS_PER_DAY,
  );
  return Math.max(days, 1);
}

export function calculateTotalPrice(
  pricePerDay: number,
  startDate: Date,
  endDate: Date,
): number {
  const days = calculateRentalDays(startDate, endDate);
  return Math.round(pricePerDay * days * 100) / 100;
}
