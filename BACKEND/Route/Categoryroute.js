import express from "express";
const router = express.Router();

import { 
  addCategory, 
  deleteCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategory 
} from '../Controller/CategoryController.js';  

router.get("/api/categories", getAllCategories);  

router.post("/api/categories", addCategory);  

router.get("/api/categories/:id", getCategoryById);  

router.put("/api/categories/:id", updateCategory);  

router.delete("/api/categories/:id", deleteCategory);  

export default router;
