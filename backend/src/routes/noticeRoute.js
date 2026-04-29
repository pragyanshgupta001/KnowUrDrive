import express from "express";
import {
  getNotices,
  getNoticeById,
  updateNotice,
  deleteNotice
} from "../controllers/noticeController.js";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/",      getNotices);
router.get("/:id",   getNoticeById);

// TPO only — edit and delete
router.put("/:id", authorizeRoles("TPO", "ADMIN"), updateNotice);
router.delete("/:id", authorizeRoles("TPO", "ADMIN"), deleteNotice);

export default router;