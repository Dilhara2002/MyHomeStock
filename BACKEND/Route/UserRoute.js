import express from "express";

import {
  signup,
  login,
  getProfile,
  updateProfile,
  deleteUser,
} from "../Controller/UserController.js";
import { protect, authorize } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);


// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin-only routes
router.delete("/:id", protect, authorize(["admin"]), deleteUser);

export default router;