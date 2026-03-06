import express from "express";
import { 
  sendReservation, 
  getMyReservations,
  getAllReservations,
  updateReservationStatus 
} from "../controller/reservation.js";
import { isAuthenticated, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

// Public route
router.post("/send", sendReservation);

// Customer route
router.get("/my-reservations", isAuthenticated, getMyReservations);

// Admin routes
router.get("/admin/all", isAuthenticated, authorizeRoles("admin"), getAllReservations);
router.put("/admin/:id/status", isAuthenticated, authorizeRoles("admin"), updateReservationStatus);

export default router;