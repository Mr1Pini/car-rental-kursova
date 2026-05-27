import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import * as adminReviewController from "../controllers/adminReview.controller";
import * as userController from "../controllers/user.controller";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(authenticate, requireAdmin);

/**
 * @openapi
 * /api/admin/stats:
 *   get:
 *     tags: [Admin]
 *     summary: Dashboard metrics
 *     security:
 *       - bearerAuth: []
 */
router.get("/stats", adminController.getStats);

/**
 * @openapi
 * /api/admin/analytics:
 *   get:
 *     tags: [Admin]
 *     summary: Analytics for charts (monthly revenue, top cars)
 *     security:
 *       - bearerAuth: []
 */
router.get("/analytics", adminController.getAnalytics);

/**
 * @openapi
 * /api/admin/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 */
router.get("/users", userController.getAllUsers);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   put:
 *     tags: [Admin]
 *     summary: Update user
 *     security:
 *       - bearerAuth: []
 */
router.put("/users/:id", userController.updateUser);

/**
 * @openapi
 * /api/admin/users/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete user
 *     security:
 *       - bearerAuth: []
 */
router.delete("/users/:id", userController.deleteUser);

/**
 * @openapi
 * /api/admin/reviews:
 *   get:
 *     tags: [Admin]
 *     summary: Get all reviews
 *     security:
 *       - bearerAuth: []
 */
router.get("/reviews", adminReviewController.getAllReviews);

/**
 * @openapi
 * /api/admin/reviews/{id}:
 *   delete:
 *     tags: [Admin]
 *     summary: Delete review
 *     security:
 *       - bearerAuth: []
 */
router.delete("/reviews/:id", adminReviewController.deleteReview);

export default router;
