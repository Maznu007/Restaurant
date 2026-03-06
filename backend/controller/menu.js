import MenuItem from "../models/menuItemSchema.js";

// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const { category, isSpecial } = req.query;
    let query = { isAvailable: true };

    if (category) query.category = category;
    if (isSpecial) query.isSpecial = true;

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      menuItems,
    });
  } catch (error) {
    console.error("Get menu error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Get single menu item
export const getMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }

    res.status(200).json({
      success: true,
      menuItem,
    });
  } catch (error) {
    console.error("Get menu item error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Seed initial menu
export const seedMenu = async (req, res) => {
  try {
    // Check if menu already exists
    const existing = await MenuItem.findOne();
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Menu already seeded. Delete existing items first."
      });
    }

    const defaultMenu = [
      {
        name: "Lamb Rump with Rosemary",
        description: "Grass-fed Dorset lamb, slow-roasted over oak with garlic and wild rosemary.",
        price: 28,
        category: "main",
        image: "./dinner1.jpeg",
        ingredients: ["Lamb rump", "Rosemary", "Garlic", "Parsnip", "Spring onions"],
        dietaryTags: ["gluten-free"],
      },
      {
        name: "Citrus Cured Salmon",
        description: "Scottish salmon cured for 48 hours in lemon, dill, and juniper.",
        price: 16,
        category: "appetizer",
        image: "./dinner2.png",
        ingredients: ["Scottish salmon", "Lemon", "Dill", "Juniper berries", "Rye flour"],
        dietaryTags: ["dairy-free"],
      },
      {
        name: "Hand-Rolled Pappardelle",
        description: "Wide ribbons of pasta with slow-braised beef shin ragu.",
        price: 24,
        category: "main",
        image: "./dinner5.png",
        ingredients: ["00 flour", "Eggs", "Beef shin", "San Marzano tomatoes", "Red wine"],
        isSpecial: true,
      },
      {
        name: "Honey Roasted Figs",
        description: "Black mission figs roasted with thyme honey and mascarpone.",
        price: 12,
        category: "dessert",
        image: "./dinner3.png",
        ingredients: ["Black mission figs", "Thyme honey", "Mascarpone", "Walnuts"],
        dietaryTags: ["vegetarian"],
      },
    ];

    await MenuItem.insertMany(defaultMenu);

    res.status(201).json({
      success: true,
      message: "Menu seeded successfully",
    });
  } catch (error) {
    console.error("Seed menu error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// ========== ADMIN FUNCTIONS ==========

// Create menu item (admin only)
export const createMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      message: "Menu item created",
      menuItem,
    });
  } catch (error) {
    console.error("Create menu item error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Update menu item (admin only)
export const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item updated",
      menuItem,
    });
  } catch (error) {
    console.error("Update menu item error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Delete menu item (admin only)
export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item deleted",
    });
  } catch (error) {
    console.error("Delete menu item error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Get all menu items for admin (including unavailable)
export const getAllMenuItemsAdmin = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      menuItems,
    });
  } catch (error) {
    console.error("Get all menu admin error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};