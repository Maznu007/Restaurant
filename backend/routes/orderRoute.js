import express from "express";
import { createOrder, getMyOrders, getOrderDetails } from "../controller/order.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", isAuthenticated, createOrder);
router.get("/my-orders", isAuthenticated, getMyOrders);
router.get("/:id", isAuthenticated, getOrderDetails);

export default router;