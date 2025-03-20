import express from "express";
import {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  checkExpiringItems,
} from "../Controller/InventoryController.js"; 

const router = express.Router();

// Define routes
router.post("/", createItem); // Create a new item
router.get("/", getItems); // Get all items
router.get("/:id", getItemById); // Get a single item by ID
router.put("/:id", updateItem); // Update an item
router.delete("/:id", deleteItem); // Delete an item
router.get("/expiring", checkExpiringItems); // Check for expiring items

export default router;