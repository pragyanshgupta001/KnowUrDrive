import express from "express";
import {
  requestCollegeRegistration,
  getApprovedColleges,
  getCollegeByCode
} from "../controllers/collegeController.js";

const router = express.Router();

// All public — no auth needed
router.get("/", getApprovedColleges);
router.get("/:code", getCollegeByCode);
router.post("/request", requestCollegeRegistration);

export default router;