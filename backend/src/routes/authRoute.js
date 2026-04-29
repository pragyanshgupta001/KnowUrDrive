import express from "express";
import {
  registerUser,
  registerTPO,
  loginUser,
  getMe,
  updateProfile,
  changePassword
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/register-tpo", protect, authorizeRoles("ADMIN"), registerTPO);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;