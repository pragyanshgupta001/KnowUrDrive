import User from "../models/User.js";
import Drive from "../models/Drive.js";
import Application from "../models/Application.js";
import Notice from "../models/Notice.js";
import { notifyNewDrive, notifyStatusChange } from "../services/notificationService.js";


// TPO DASHBOARD SUMMARY
export const getTPODashboard = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    const [totalStudents, placedStudents, activeDrives, totalDrives, totalNotices] =
      await Promise.all([
        User.countDocuments({ collegeId, role: "STUDENT", isActive: true }),
        User.countDocuments({ collegeId, role: "STUDENT", placementStatus: "PLACED" }),
        Drive.countDocuments({ collegeId, isActive: true }),
        Drive.countDocuments({ collegeId }),
        Notice.countDocuments({ collegeId })
      ]);

    const placementPercentage = totalStudents
      ? ((placedStudents / totalStudents) * 100).toFixed(1)
      : 0;

    // Recent drives
    const recentDrives = await Drive.find({ collegeId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("companyName role ctcOffered isActive createdAt");

    res.json({
      stats: {
        totalStudents,
        placedStudents,
        unplacedStudents: totalStudents - placedStudents,
        placementPercentage: `${placementPercentage}%`,
        activeDrives,
        totalDrives,
        totalNotices
      },
      recentDrives
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ALL STUDENTS in TPO's college
export const getAllStudents = async (req, res) => {
  try {
    const { department, placementStatus, year } = req.query;

    const filter = {
      collegeId: req.user.collegeId,
      role: "STUDENT",
      isActive: true
    };

    if (department)       filter.department = department;
    if (placementStatus)  filter.placementStatus = placementStatus.toUpperCase();
    if (year)             filter.year = Number(year);

    const students = await User.find(filter)
      .select("-password")
      .populate("acceptedDriveId", "companyName role ctcOffered")
      .sort({ name: 1 });

    res.json(students);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// APPLICANTS FOR A DRIVE
export const getDriveApplicants = async (req, res) => {
  try {
    const drive = await Drive.findOne({
      _id: req.params.driveId,
      collegeId: req.user.collegeId
    });

    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    const applications = await Application.find({ driveId: req.params.driveId })
      .populate("studentId", "name email department year cgpa resumeUrl placementStatus")
      .sort({ createdAt: -1 });

    res.json({ drive, applications });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE APPLICATION STATUS
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const validStatuses = ["APPLIED", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
    }

    const application = await Application.findById(req.params.applicationId)
      .populate("driveId")
      .populate("studentId", "name email placementStatus");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.collegeId.toString() !== req.user.collegeId.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    application.status = status;
    if (remarks) application.remarks = remarks;
    await application.save();

    // If SELECTED → lock the student
    if (status === "SELECTED") {
      await User.findByIdAndUpdate(application.studentId._id, {
        placementStatus: "PLACED",
        currentOfferCTC: application.ctcAtApplication,
        acceptedDriveId: application.driveId._id
      });
    }

    // Send email notification
    await notifyStatusChange(
      application.studentId,
      application.driveId,
      status,
      remarks
    );

    res.json(application);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// PLACEMENT ANALYTICS
export const getPlacementAnalytics = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    // Placed students
    const placedStudents = await User.find({
      collegeId,
      role: "STUDENT",
      placementStatus: "PLACED"
    }).populate("acceptedDriveId", "companyName ctcOffered");

    // CTC breakdown
    const ctcValues = placedStudents
      .map(s => s.currentOfferCTC)
      .filter(Boolean);

    const avgCTC = ctcValues.length
      ? (ctcValues.reduce((a, b) => a + b, 0) / ctcValues.length).toFixed(2)
      : 0;

    const maxCTC = ctcValues.length ? Math.max(...ctcValues) : 0;
    const minCTC = ctcValues.length ? Math.min(...ctcValues) : 0;

    // Top companies by selection count
    const companyMap = {};
    placedStudents.forEach(s => {
      const name = s.acceptedDriveId?.companyName;
      if (name) companyMap[name] = (companyMap[name] || 0) + 1;
    });

    const topCompanies = Object.entries(companyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([company, count]) => ({ company, count }));

    // Branch-wise placement
    const branchMap = {};
    placedStudents.forEach(s => {
      const dept = s.department || "Unknown";
      branchMap[dept] = (branchMap[dept] || 0) + 1;
    });

    res.json({
      totalPlaced: placedStudents.length,
      ctcStats: { avgCTC, maxCTC, minCTC },
      topCompanies,
      branchWisePlacement: branchMap
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// POST NOTICE + NOTIFY
export const createNoticeAndNotify = async (req, res) => {
  try {
    const { title, description, priority, attachments } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const Notice = (await import("../models/Notice.js")).default;

    const notice = await Notice.create({
      title,
      description,
      priority: priority || "MEDIUM",
      attachments: attachments || [],
      collegeId: req.user.collegeId,
      postedBy: req.user._id
    });

    res.status(201).json(notice);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// POST DRIVE + NOTIFY ELIGIBLE STUDENTS
export const createDriveAndNotify = async (req, res) => {
  try {
    const {
      companyName, role, description, ctcOffered, ctcType,
      eligibility, driveDate, deadline, selectionProcess,
      jobLocation, jobType, attachments
    } = req.body;

    if (!companyName || !role || !ctcOffered) {
      return res.status(400).json({ message: "Company name, role and CTC are required" });
    }

    const drive = await Drive.create({
      companyName, role, description, ctcOffered, ctcType,
      eligibility, driveDate, deadline, selectionProcess,
      jobLocation, jobType,
      attachments: attachments || [],
      collegeId: req.user.collegeId,
      createdBy: req.user._id
    });

    // Fire-and-forget email notifications (don't await — don't block response)
    notifyNewDrive(drive).catch(err =>
      console.error("Background notification error:", err.message)
    );

    res.status(201).json(drive);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};