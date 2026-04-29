import User from "../models/User.js";
import Application from "../models/Application.js";
import Drive from "../models/Drive.js";
import { checkEligibility } from "../services/eligibilityService.js";


// MY PLACEMENT STATUS
export const getMyPlacementStatus = async (req, res) => {
  try {
    const student = await User.findById(req.user._id)
      .select("-password")
      .populate("acceptedDriveId", "companyName role ctcOffered");

    res.json({
      placementStatus: student.placementStatus,
      currentOfferCTC: student.currentOfferCTC,
      acceptedDrive:   student.acceptedDriveId
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// MY APPLICATIONS with full status tracker
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate("driveId", "companyName role ctcOffered driveDate jobType")
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ELIGIBLE DRIVES for this student
// Returns drives with eligibility breakdown — student sees exactly why they can/cannot apply
export const getEligibleDrives = async (req, res) => {
  try {
    const drives = await Drive.find({
      collegeId: req.user.collegeId,
      isActive: true
    }).sort({ createdAt: -1 });

    const appliedDriveIds = await Application.find({
      studentId: req.user._id
    }).distinct("driveId");

    const appliedSet = new Set(appliedDriveIds.map(id => id.toString()));

    const result = drives.map(drive => {
      const d = drive.toObject();
      d.alreadyApplied   = appliedSet.has(drive._id.toString());
      d.eligibilityCheck = checkEligibility(drive, req.user);
      return d;
    });

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DASHBOARD SUMMARY
export const getStudentDashboard = async (req, res) => {
  try {
    const [totalApplications, shortlisted, selected, activeDrives] = await Promise.all([
      Application.countDocuments({ studentId: req.user._id }),
      Application.countDocuments({ studentId: req.user._id, status: "SHORTLISTED" }),
      Application.countDocuments({ studentId: req.user._id, status: "SELECTED" }),
      Drive.countDocuments({ collegeId: req.user.collegeId, isActive: true })
    ]);

    // Recent applications
    const recentApplications = await Application.find({ studentId: req.user._id })
      .populate("driveId", "companyName role ctcOffered")
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      stats: { totalApplications, shortlisted, selected, activeDrives },
      placementStatus:  req.user.placementStatus,
      currentOfferCTC:  req.user.currentOfferCTC,
      recentApplications
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};