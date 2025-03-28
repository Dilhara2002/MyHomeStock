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