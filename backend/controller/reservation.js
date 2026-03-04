import ErrorHandler from "../error/error.js";
import Reservation from "../models/reservationSchema.js";

export const sendReservation = async (req, res, next) => {
  const { firstName, lastName, email, date, time, phone } = req.body;

  if (!firstName || !lastName || !email || !phone || !date || !time) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  try {
    const reservation = await Reservation.create({
      firstName,
      lastName,
      email,
      phone,
      date,
      time,
    });

    res.status(200).json({
      success: true,
      message: "Reservation created successfully",
      reservation,
    });

  } catch (error) {
    return next(error);
  }
};