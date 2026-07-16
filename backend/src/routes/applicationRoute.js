import express from "express";
import {
  applyToDrive,
  getMyApplications,
  withdrawApplication
} from "../controllers/applicationController.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {placementLockMiddleware} from "../middleware/placementLockMiddleware.js";

const router = express.Router();

router.use(protect);

// Student routes
router.post(
  "/:driveId/apply",
  authorizeRoles("STUDENT"),
  placementLockMiddleware,     // tier lock check runs here before controller
  applyToDrive
);

router.get(
  "/my",
  authorizeRoles("STUDENT"),
  getMyApplications
);

router.delete(
  "/:applicationId/withdraw",
  authorizeRoles("STUDENT"),
  withdrawApplication
);

export default router;