import express from "express";
import {
  getMyPlacementStatus,
  getMyApplications,
  getEligibleDrives,
  getStudentDashboard
} from "../controllers/studentController.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("STUDENT"));

router.get("/dashboard", getStudentDashboard);
router.get("/placement-status", getMyPlacementStatus);
router.get("/applications", getMyApplications);
router.get("/eligible-drives", getEligibleDrives);

export default router;