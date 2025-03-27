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
    timestamps: true
  }
);

export default mongoose.model("ShoppingList", shoppingListSchema);