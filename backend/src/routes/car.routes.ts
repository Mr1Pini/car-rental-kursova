import { Router } from "express";
import * as carController from "../controllers/car.controller";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

/**
 * @openapi
 * /api/cars:
 *   get:
 *     tags: [Cars]
 *     summary: Get all cars with optional filters
 *     parameters:
 *       - in: query
 *         name: brand
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: isAvailable
 *         schema: { type: boolean }
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, year_desc]
 *     responses:
 *       200:
 *         description: List of cars
 */
router.get("/", carController.getCars);

/**
 * @openapi
 * /api/cars/{id}:
 *   get:
 *     tags: [Cars]
 *     summary: Get car by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Car details
 *       404:
 *         description: Car not found
 */
router.get("/:id", carController.getCarById);

/**
 * @openapi
 * /api/cars:
 *   post:
 *     tags: [Cars]
 *     summary: Create a car (Admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarInput'
 *     responses:
 *       201:
 *         description: Car created
 *       403:
 *         description: Forbidden
 */
router.post("/", authenticate, requireAdmin, carController.createCar);

/**
 * @openapi
 * /api/cars/{id}:
 *   put:
 *     tags: [Cars]
 *     summary: Update a car (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarInput'
 *     responses:
 *       200:
 *         description: Car updated
 */
router.put("/:id", authenticate, requireAdmin, carController.updateCar);

/**
 * @openapi
 * /api/cars/{id}:
 *   delete:
 *     tags: [Cars]
 *     summary: Delete a car (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       204:
 *         description: Car deleted
 */
router.delete("/:id", authenticate, requireAdmin, carController.deleteCar);

export default router;
