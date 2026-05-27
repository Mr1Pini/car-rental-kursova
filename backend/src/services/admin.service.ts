import { RentalStatus, Role } from "@prisma/client";
import { prisma } from "../lib/prisma";

const UKRAINIAN_MONTHS = [
  "Січ",
  "Лют",
  "Бер",
  "Кві",
  "Тра",
  "Чер",
  "Лип",
  "Сер",
  "Вер",
  "Жов",
  "Лис",
  "Гру",
];

function formatMonthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function formatMonthLabel(key: string): string {
  const [year, month] = key.split("-");
  const idx = Number(month) - 1;
  return `${UKRAINIAN_MONTHS[idx] ?? month} ${year}`;
}

export class AdminService {  async getStats() {
    const [totalClients, totalCars, revenueResult] = await Promise.all([
      prisma.user.count({ where: { role: Role.USER } }),
      prisma.car.count(),
      prisma.rental.aggregate({
        where: {
          status: { in: [RentalStatus.ACTIVE, RentalStatus.COMPLETED] },
        },
        _sum: { totalPrice: true },
      }),
    ]);

    return {
      totalClients,
      totalCars,
      totalRevenue: revenueResult._sum.totalPrice ?? 0,
    };
  }

  async getAnalytics() {
    const monthsCount = 12;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - (monthsCount - 1), 1);

    const [completedRentals, topCarsRaw] = await Promise.all([
      prisma.rental.findMany({
        where: {
          status: RentalStatus.COMPLETED,
          startDate: { gte: startDate },
        },
        select: {
          totalPrice: true,
          startDate: true,
        },
      }),
      prisma.car.findMany({
        select: {
          id: true,
          brand: true,
          model: true,
          _count: { select: { rentals: true } },
        },
        orderBy: { rentals: { _count: "desc" } },
        take: 5,
      }),
    ]);

    const revenueByMonth = new Map<string, number>();
    for (let i = 0; i < monthsCount; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - (monthsCount - 1 - i), 1);
      revenueByMonth.set(formatMonthKey(d), 0);
    }

    for (const rental of completedRentals) {
      const key = formatMonthKey(rental.startDate);
      if (revenueByMonth.has(key)) {
        revenueByMonth.set(key, (revenueByMonth.get(key) ?? 0) + rental.totalPrice);
      }
    }

    const monthlyRevenue = Array.from(revenueByMonth.entries()).map(
      ([month, revenue]) => ({
        month,
        label: formatMonthLabel(month),
        revenue: Math.round(revenue * 100) / 100,
      }),
    );

    const topCars = topCarsRaw.map((car) => ({
      id: car.id,
      brand: car.brand,
      model: car.model,
      label: `${car.brand} ${car.model}`,
      rentalCount: car._count.rentals,
    }));

    return { monthlyRevenue, topCars };
  }
}

export const adminService = new AdminService();
