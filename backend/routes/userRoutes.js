import express from "express";
import {
  deleteUser,
  getAllUser,
  getUserById,
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
  getCurrentUser,
  updateProfile,
} from "../Controller/userController.js";
import { verifyUser, authorizeRoles } from "../helper/userAuth.js";

const router = express.Router();

// Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/logout").get(logoutUser).post(logoutUser);

// Profile
router.get("/me", verifyUser, getCurrentUser);
router.put("/me/update", verifyUser, updateProfile);

// Admin User Management
router.get("/users", verifyUser, authorizeRoles("admin"), getAllUser);
router
  .route("/user/:id")
  .get(verifyUser, getUserById)
  .put(verifyUser, authorizeRoles("admin"), updateUser)
  .delete(verifyUser, authorizeRoles("admin"), deleteUser);

export default router;
