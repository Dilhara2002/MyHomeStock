import mongoose from "mongoose";

const shoppingListSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true }
      }
    ]
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model("ShoppingList", shoppingListSchema);
