import express from "express";
import { fetchShoppingList, addToShoppingList, removeFromShoppingList } from "../Controller/ShoppingListController.js";

const router = express.Router();

// Route to fetch shopping list for a specific user
router.get("/shopping-list/:userId", fetchShoppingList);

// Route to add an item to the shopping list
router.post("/shopping-list/add", addToShoppingList);

// Route to remove an item from the shopping list
router.delete("/shopping-list/remove/:userId/:itemName", removeFromShoppingList);

export default router;