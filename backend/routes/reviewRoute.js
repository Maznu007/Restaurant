import express from "express";
import { createReview, getMyReviews, getDishReviews } from "../controller/review.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, createReview);
router.get("/my-reviews", isAuthenticated, getMyReviews);
router.get("/dish/:dishId", getDishReviews);

export default router;