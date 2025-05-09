import express from "express";
const router = express.Router();

// Import controller functions
import { 
  addCategory, 
  deleteCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategory 
} from '../Controller/CategoryController.js';  // Ensure correct import of controller functions

// Define routes for categories

// Fetch all categories
router.get("/api/categories", getAllCategories);  

// Add a new category
router.post("/api/categories", addCategory);  

// Fetch category by ID
router.get("/api/categories/:id", getCategoryById);  

// Update category by ID
router.put("/api/categories/:id", updateCategory);  

// Delete category by ID
router.delete("/api/categories/:id", deleteCategory);  

// Export the router for use in app.js or main routing file
export default router;