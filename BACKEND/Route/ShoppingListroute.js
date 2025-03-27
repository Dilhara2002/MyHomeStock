import express from "express";
import {
  getShoppingList,
  addToShoppingList,
  purchaseItem,
  toggleAutoReplenish,
  createManualItem,
  updateShoppingListItem,
  clearPurchasedItems
} from "../controllers/ShoppingListController.js";

const router = express.Router();

// GET all shopping list items (auto-generated + manual)
router.get("/", getShoppingList);

// POST add inventory item to shopping list (by ID)
router.post("/add-from-inventory/:inventoryId", addToShoppingList);

// POST create a manual shopping list item (not in inventory)
router.post("/manual", createManualItem);

// PATCH update shopping list item (quantity, notes, etc.)
router.patch("/:itemId", updateShoppingListItem);

// POST mark item as purchased (updates inventory if linked)
router.post("/purchase/:itemId", purchaseItem);

// DELETE clear all purchased items
router.delete("/clear-completed", clearPurchasedItems);

// POST toggle auto-replenish for an inventory item
router.post("/toggle-auto/:inventoryId", toggleAutoReplenish);

export default router;