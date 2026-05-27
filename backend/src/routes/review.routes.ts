import { Router } from "express";
import * as reviewController from "../controllers/review.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

/**
 * @openapi
 * /api/reviews/car/{carId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews for a car
 *     parameters:
 *       - in: path
 *         name: carId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get("/car/:carId", reviewController.getReviewsByCar);

/**
 * @openapi
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Add a review for a car
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carId, rating, comment]
 *             properties:
 *               carId: { type: integer }
 *               rating: { type: integer, minimum: 1, maximum: 5 }
 *               comment: { type: string }
 *     responses:
 *       201:
 *         description: Review created
 */
router.post("/", authenticate, reviewController.createReview);

export default router;
