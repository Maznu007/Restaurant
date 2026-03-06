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

// ========== ADMIN FUNCTIONS ==========

// Get all reservations (admin only)
export const getAllReservations = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) query.status = status;

    const reservations = await Reservation.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email phone");

    res.status(200).json({
      success: true,
      count: reservations.length,
      reservations,
    });
  } catch (error) {
    console.error("Get all reservations error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Update reservation status (admin only)
export const updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ["pending", "confirmed", "seated", "completed", "cancelled", "no-show"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "firstName lastName email");

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Reservation status updated",
      reservation,
    });
  } catch (error) {
    console.error("Update reservation status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};