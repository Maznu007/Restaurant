import express from "express";
import { 
  createReview, 
  getMyReviews, 
  getDishReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview 
} from "../controller/review.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public route
router.get("/dish/:dishId", getDishReviews);

// Customer routes
router.post("/create", isAuthenticated, createReview);
router.get("/my-reviews", isAuthenticated, getMyReviews);

// Admin routes
router.get("/admin/all", isAuthenticated, authorizeRoles("admin"), getAllReviews);
router.put("/admin/:id/status", isAuthenticated, authorizeRoles("admin"), updateReviewStatus);
router.delete("/admin/:id", isAuthenticated, authorizeRoles("admin"), deleteReview);

export default router;