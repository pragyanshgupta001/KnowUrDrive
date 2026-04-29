import express from "express";
import {
  getDrives,
  getDriveById,
  updateDrive,
  deleteDrive
} from "../controllers/driveController.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get("/", getDrives);
router.get("/:id", getDriveById);
router.put("/:id", authorizeRoles("TPO", "ADMIN"), updateDrive);
router.delete("/:id", authorizeRoles("TPO", "ADMIN"), deleteDrive);

export default router;