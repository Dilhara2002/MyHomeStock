import express from "express";
import { 
  fetchShoppingList, 
  addToShoppingList, 
  removeFromShoppingList,
  updateShoppingListItem,
  autoAddLowStockItems,
  getAutoAddedShoppingListItems
} from "../Controller/ShoppingListController.js";

import { authenticateUser } from "../Controller/UserController.js";

const router = express.Router();

// Protected routes (require authentication)
router.get("/", authenticateUser, fetchShoppingList);
router.post("/add", authenticateUser, addToShoppingList);
router.delete("/remove/:itemName", authenticateUser, removeFromShoppingList);
router.put("/update/:itemName", authenticateUser, updateShoppingListItem);
router.post("/auto-add", authenticateUser, autoAddLowStockItems);

// Get auto-added items
router.get("/auto-added", authenticateUser, getAutoAddedShoppingListItems);

export default router;