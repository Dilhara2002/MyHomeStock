const mongoose = require('mongoose');

// Define the schema for the Shopping List
const shoppingListSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',  // Reference to the Inventory model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,  // Quantity should be at least 1
    },
  },
  { timestamps: true }  // Automatically manage createdAt and updatedAt
);

// Create the ShoppingList model
const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

module.exports = ShoppingList;
