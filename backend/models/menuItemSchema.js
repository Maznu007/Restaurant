import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Dish name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: String,
    enum: ["appetizer", "main", "dessert", "drink", "special"],
    required: true,
  },
  image: {
    type: String,
    default: "/default-dish.png",
  },
  ingredients: [String],
  dietaryTags: [String],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  isSpecial: {
    type: Boolean,
    default: false,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export default MenuItem;