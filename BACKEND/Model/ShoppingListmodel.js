import mongoose from 'mongoose';

const shoppingListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    addedAutomatically: {
      type: Boolean,
      default: false
    }
  }]
});

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

export default ShoppingList;
