import express from "express";
import { 
  createOrder, 
  getMyOrders, 
  getOrderDetails,
  getAllOrders,
  updateOrderStatus 
} from "../controller/order.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Customer routes
router.post("/create", isAuthenticated, createOrder);
router.get("/my-orders", isAuthenticated, getMyOrders);
router.get("/:id", isAuthenticated, getOrderDetails);

// Admin routes
router.get("/admin/all", isAuthenticated, authorizeRoles("admin"), getAllOrders);
router.put("/admin/:id/status", isAuthenticated, authorizeRoles("admin"), updateOrderStatus);

export default router;