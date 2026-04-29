import Application from "../models/Application.js";
import Drive from "../models/Drive.js";
import { checkEligibility } from "../services/eligibilityService.js";


// APPLY TO DRIVE (student)
export const applyToDrive = async (req, res) => {
  try {
    const drive = await Drive.findOne({
      _id: req.params.driveId,
      collegeId: req.user.collegeId,
      isActive: true
    });

    if (!drive) {
      return res.status(404).json({ message: "Drive not found or inactive" });
    }

    // Deadline check
    if (drive.deadline && new Date() > drive.deadline) {
      return res.status(400).json({ message: "Application deadline has passed" });
    }

    // CGPA + branch eligibility check
    const { eligible, reasons } = checkEligibility(drive, req.user);
    if (!eligible) {
      return res.status(403).json({ message: "Not eligible for this drive", reasons });
    }

    // Create application
    // Unique index on studentId + driveId in the model handles duplicate apply attempts
    const application = await Application.create({
      studentId: req.user._id,
      driveId: drive._id,
      collegeId: req.user.collegeId,
      ctcAtApplication: drive.ctcOffered
    });

    res.status(201).json(application);

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already applied to this drive" });
    }
    res.status(500).json({ message: error.message });
  }
};


// GET MY APPLICATIONS
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate("driveId", "companyName role ctcOffered driveDate jobType jobLocation")
      .sort({ createdAt: -1 });

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// WITHDRAW APPLICATION
export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.applicationId,
      studentId: req.user._id    // student can only withdraw their own
    }).populate("driveId");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Can only withdraw if still in APPLIED state
    if (application.status !== "APPLIED") {
      return res.status(400).json({
        message: `Cannot withdraw — your application is already ${application.status}`
      });
    }

    // Can only withdraw before deadline
    if (application.driveId.deadline && new Date() > application.driveId.deadline) {
      return res.status(400).json({ message: "Cannot withdraw after deadline" });
    }

    await Application.findByIdAndDelete(req.params.applicationId);

    res.json({ message: "Application withdrawn successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};