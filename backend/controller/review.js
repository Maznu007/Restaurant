import Review from "../models/reviewSchema.js";
import MenuItem from "../models/menuItemSchema.js";

// Create review
export const createReview = async (req, res) => {
  try {
    const { dishId, reservationId, rating, comment } = req.body;

    if (!dishId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Please provide dish, rating and comment"
      });
    }

    // Check if user already reviewed this dish
    const existingReview = await Review.findOne({
      user: req.user.id,
      dish: dishId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this dish"
      });
    }

    const review = await Review.create({
      user: req.user.id,
      dish: dishId,
      reservation: reservationId || null,
      rating,
      comment,
    });

    // Update dish average rating
    const reviews = await Review.find({ dish: dishId, isApproved: true });
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      await MenuItem.findByIdAndUpdate(dishId, {
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      });
    }

    res.status(201).json({
      success: true,
      message: "Review submitted and pending approval",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Get user's reviews
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("dish", "name image");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Get reviews for a dish
export const getDishReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      dish: req.params.dishId,
      isApproved: true 
    })
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get dish reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};