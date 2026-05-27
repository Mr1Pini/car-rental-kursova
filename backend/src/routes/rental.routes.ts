import { Router } from "express";
import * as rentalController from "../controllers/rental.controller";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

/**
 * @openapi
 * /api/rentals:
 *   post:
 *     tags: [Rentals]
 *     summary: Create a rental order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carId, startDate, endDate]
 *             properties:
 *               carId: { type: integer }
 *               startDate: { type: string, format: date-time, example: "2026-06-01T00:00:00.000Z" }
 *               endDate: { type: string, format: date-time, example: "2026-06-05T00:00:00.000Z" }
 *     responses:
 *       201:
 *         description: Rental created with calculated totalPrice
 */
router.post("/", authenticate, rentalController.createRental);

/**
 * @openapi
 * /api/rentals/my:
 *   get:
 *     tags: [Rentals]
 *     summary: Get current user rental history
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User rentals
 */
router.get("/my", authenticate, rentalController.getMyRentals);

/**
 * @openapi
 * /api/rentals:
 *   get:
 *     tags: [Rentals]
 *     summary: Get all rentals (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All rentals
 */
router.get("/", authenticate, requireAdmin, rentalController.getAllRentals);

/**
 * @openapi
 * /api/rentals/{id}/status:
 *   patch:
 *     tags: [Rentals]
 *     summary: Update rental status (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, ACTIVE, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch(
  "/:id/status",
  authenticate,
  requireAdmin,
  rentalController.updateRentalStatus,
);

export default router;
