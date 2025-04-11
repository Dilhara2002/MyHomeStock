import express from "express";
import { upload, processImage } from '../Middleware/upload.js';
import {
  signup,
  login,
  getProfile,
  updateProfile,
  deleteUser,
  getProfilePicture,
} from "../Controller/UserController.js";
import { protect, authorize } from "../Middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);


// Protected routes
router.get("/profile", protect, getProfile);
// router.put("/profile", protect, updateProfile);

// Admin-only routes
router.delete("/:id", protect, authorize(["admin"]), deleteUser);

router.put(
  '/profile/image',
  protect,
  upload.single('profilePicture'),
  processImage,
  updateProfile
);
router.get('/profile/image', protect, getProfilePicture);

export default router;