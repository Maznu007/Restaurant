import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: [3, "First name must be at least 3 characters long"],
    maxLength: [30, "First name must be at most 30 characters long"],
  },
  lastName: {
    type: String,
    required: true,
    minLength: [3, "Last name must be at least 3 characters long"],
    maxLength: [30, "Last name must be at most 30 characters long"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: true,
    minLength: [11, "Phone number must be 11 digits"],
    maxLength: [11, "Phone number must be 11 digits"],
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  partySize: {
    type: Number,
    default: 2
  },
  notes: {
    type: String,
    maxLength: [500, "Notes cannot exceed 500 characters"]
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "seated", "completed", "cancelled", "no-show"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Reservation = mongoose.model("Reservation", reservationSchema);
export default Reservation;