
import express from "express";
import { 
  fetchShoppingList, 
  addToShoppingList, 
  removeFromShoppingList,
  updateShoppingListItem // Make sure this is imported
} from "../Controller/ShoppingListController.js";
import { authenticateUser } from "../Controller/UserController.js";

const router = express.Router();

// Protected routes (require authentication)
router.get("/", authenticateUser, fetchShoppingList);
router.post("/add", authenticateUser, addToShoppingList);
router.delete("/remove/:itemName", authenticateUser, removeFromShoppingList);
router.put("/update/:itemName", authenticateUser, updateShoppingListItem); // New update route

export default router;

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

