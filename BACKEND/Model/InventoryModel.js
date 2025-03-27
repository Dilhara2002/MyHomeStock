import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,  // Ensure inventory items have unique names
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ["kg", "liters", "pieces"], // Allowed units
      default: "pieces", // Default unit
    },
    expiryDate: {
      type: Date,
      required: false,
    },
    category: {
      type: String,
      required: false,
      trim: true,
    },
    // New fields for shopping list integration
    threshold: {
      type: Number,
      required: false,
      default: 5, // Default low-stock threshold
      min: 1
    },
    isAutoAdded: {
      type: Boolean,
      default: false // Track if automatically added to shopping list
    },
    purchaseFrequency: {
      type: Number,
      default: 0 // Track how often this item is purchased
    },
    lastPurchased: {
      type: Date // Track when this item was last purchased
    }
  },
  {
    timestamps: true,
  }
);

// Create the Inventory model
const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;