import Order from "../models/orderSchema.js";

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, orderType, pickupTime, specialInstructions } = req.body;

    if (!items || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Please provide order items and total amount"
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      orderType: orderType || "pickup",
      pickupTime,
      specialInstructions,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Get user's orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.dishId", "name image");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Get single order
export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("items.dishId");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};