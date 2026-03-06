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

// ========== ADMIN FUNCTIONS ==========

// Get all reviews (admin only)
export const getAllReviews = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status === "pending") query.isApproved = false;
    if (status === "approved") query.isApproved = true;

    const reviews = await Review.find(query)
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email")
      .populate("dish", "name image");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Approve/reject review (admin only)
export const updateReviewStatus = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate("dish", "name").populate("user", "firstName lastName");

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Update dish average rating if approved
    if (isApproved) {
      const reviews = await Review.find({ dish: review.dish._id, isApproved: true });
      if (reviews.length > 0) {
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        await MenuItem.findByIdAndUpdate(review.dish._id, {
          averageRating: Math.round(avgRating * 10) / 10,
          reviewCount: reviews.length,
        });
      }
    } else {
      // Recalculate if rejected
      const reviews = await Review.find({ dish: review.dish._id, isApproved: true });
      const avgRating = reviews.length > 0 
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
        : 0;
      await MenuItem.findByIdAndUpdate(review.dish._id, {
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      });
    }

    res.status(200).json({
      success: true,
      message: isApproved ? "Review approved" : "Review rejected",
      review,
    });
  } catch (error) {
    console.error("Update review status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Delete review (admin only)
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }

    // Recalculate dish rating
    const reviews = await Review.find({ dish: review.dish, isApproved: true });
    const avgRating = reviews.length > 0 
      ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length 
      : 0;
    await MenuItem.findByIdAndUpdate(review.dish, {
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });

    res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};