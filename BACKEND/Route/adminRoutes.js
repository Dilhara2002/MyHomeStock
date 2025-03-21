import express from "express";
import { protect, authorize } from "../Middleware/authMiddleware.js"; // Import middleware
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
} from "../Controller/adminController.js"; // Import admin controller functions

const router = express.Router();

// Middleware to protect routes (require authentication)
// Middleware to authorize only admin users
router.use(protect); // Protect all routes below
router.use(authorize(["admin"])); // Restrict access to admins only

// Admin-only routes

// Get all users
router.get("/users", getAllUsers);

// Delete a user
router.delete("/users/:id", deleteUser);

// Update a user's role
router.put("/users/:id/role", updateUserRole);

export default router;