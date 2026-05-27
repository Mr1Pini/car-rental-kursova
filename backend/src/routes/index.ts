import { Router } from "express";
import adminRoutes from "./admin.routes";
import authRoutes from "./auth.routes";
import carRoutes from "./car.routes";
import rentalRoutes from "./rental.routes";
import reviewRoutes from "./review.routes";

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     tags: [System]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: API is running
 */
router.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Car Rental API is running" });
});

router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/cars", carRoutes);
router.use("/rentals", rentalRoutes);
router.use("/reviews", reviewRoutes);

export default router;
