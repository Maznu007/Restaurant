import ErrorHandler from "../error/error.js";
import Reservation from "../models/reservationSchema.js";

export const sendReservation = async (req, res) => {
  try {
    const { firstName, lastName, email, date, time, phone, userId, partySize, notes } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    const reservationData = {
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
      status: "pending"
    };

    // If user is logged in, link to user
    if (userId) {
      reservationData.user = userId;
    }
    if (partySize) reservationData.partySize = partySize;
    if (notes) reservationData.notes = notes;

    const reservation = await Reservation.create(reservationData);

    res.status(200).json({
      success: true,
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error("Reservation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create reservation"
    });
  }
};

// Get user's reservations
export const getMyReservations = async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email required"
      });
    }

    const reservations = await Reservation.find({ 
      $or: [
        { email: email },
        { user: req.user?.id }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations
    });
  } catch (error) {
    console.error("Get reservations error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch reservations"
    });
  }
};