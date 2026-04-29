import express from "express";
import {
  getPlatformStats,
  getAllColleges,
  updateCollegeApproval,
  registerCollege,
  createTPO,
  updateCollegePolicy,
  toggleUserStatus
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("ADMIN"));

router.get("/stats", getPlatformStats);
router.get("/colleges", getAllColleges);
router.post("/colleges", registerCollege);
router.put("/colleges/:collegeId/approval", updateCollegeApproval);
router.put("/colleges/:collegeId/policy", updateCollegePolicy);
router.post("/tpo", createTPO);
router.put("/users/:userId/toggle", toggleUserStatus);

export default router;