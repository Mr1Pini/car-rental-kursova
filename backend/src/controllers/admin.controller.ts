import { Request, Response } from "express";
import { adminService } from "../services/admin.service";
import { asyncHandler } from "../utils/asyncHandler";

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const stats = await adminService.getStats();
  res.json(stats);
});

export const getAnalytics = asyncHandler(async (_req: Request, res: Response) => {
  const analytics = await adminService.getAnalytics();
  res.json(analytics);
});
