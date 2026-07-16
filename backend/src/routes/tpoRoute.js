import express from "express";
import {
  getTPODashboard,
  getAllStudents,
  getDriveApplicants,
  updateApplicationStatus,
  getPlacementAnalytics,
  createNoticeAndNotify,
  createDriveAndNotify,
  getTPOTeam,
  createCollegeTPO,
  deleteCollegeTPO
} from "../controllers/tpoController.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect, authorizeRoles("TPO", "ADMIN"));

router.get("/dashboard", getTPODashboard);
router.get("/students", getAllStudents);
router.get("/analytics", getPlacementAnalytics);
router.get("/drives/:driveId/applicants", getDriveApplicants);
router.put("/applications/:applicationId/status", updateApplicationStatus);
router.post("/drives", createDriveAndNotify);
router.post("/notices", createNoticeAndNotify);
router.get("/team", getTPOTeam);
router.post("/team", createCollegeTPO);
router.delete("/team/:tpoId", deleteCollegeTPO);
export default router;