import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  dishId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderType: {
    type: String,
    enum: ["dine-in", "pickup", "delivery"],
    default: "pickup",
  },
  pickupTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"],
    default: "pending",
  },
  specialInstructions: {
    type: String,
    maxLength: [500, "Instructions cannot exceed 500 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;