import express from "express";
import { 
  getAllMenuItems, 
  getMenuItem, 
  seedMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getAllMenuItemsAdmin 
} from "../controller/menu.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/all", getAllMenuItems);
router.get("/:id", getMenuItem);

// Admin routes
router.get("/admin/all", isAuthenticated, authorizeRoles("admin"), getAllMenuItemsAdmin);
router.post("/admin/create", isAuthenticated, authorizeRoles("admin"), createMenuItem);
router.put("/admin/:id", isAuthenticated, authorizeRoles("admin"), updateMenuItem);
router.delete("/admin/:id", isAuthenticated, authorizeRoles("admin"), deleteMenuItem);
router.get("/seed", seedMenu); // Remove after initial setup

export default router;