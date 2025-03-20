import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
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
  },
  {
    timestamps: true,
  }
);

// Create the Inventory model
const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;