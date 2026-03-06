import express from "express";
import { 
  register, 
  login, 
  getMe, 
  logout,
  getAllUsers,
  getDashboardStats 
} from "../controller/auth.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", isAuthenticated, getMe);
router.get("/logout", isAuthenticated, logout);

// Admin routes
router.get("/admin/users", isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.get("/admin/stats", isAuthenticated, authorizeRoles("admin"), getDashboardStats);

export default router;