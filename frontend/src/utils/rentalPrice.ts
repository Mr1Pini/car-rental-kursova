const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function calculateRentalDays(start: string, end: string): number | null {
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return null;
  }
  if (endDate <= startDate) return null;
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / MS_PER_DAY,
  );
  return Math.max(days, 1);
}

export function calculateTotalPrice(
  pricePerDay: number,
  start: string,
  end: string,
): number | null {
  const days = calculateRentalDays(start, end);
  if (days === null) return null;
  return Math.round(pricePerDay * days * 100) / 100;
}
