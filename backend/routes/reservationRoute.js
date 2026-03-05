import express from "express";
import { sendReservation, getMyReservations } from "../controller/reservation.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/send", sendReservation);
router.get("/my-reservations", isAuthenticated, getMyReservations);

export default router;