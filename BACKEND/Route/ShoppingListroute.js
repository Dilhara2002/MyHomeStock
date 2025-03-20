import express from 'express';
import { 
  getAllShoppingLists,
  addItemToShoppingList,
  removeItemFromShoppingList,
  autoAddLowStockItems
} from '../controllers/shoppingListController.js';

const router = express.Router();

// Routes for shopping list functionality
router.get('/shopping-list/:userId', getAllShoppingLists);
router.post('/shopping-list/add', addItemToShoppingList);
router.delete('/shopping-list/remove/:userId/:itemName', removeItemFromShoppingList);
router.post('/shopping-list/auto-add/:userId', autoAddLowStockItems);

export default router;
