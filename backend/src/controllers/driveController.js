import Drive from "../models/Drive.js";
import Application from "../models/Application.js";
import { checkEligibility } from "../services/eligibilityService.js";

// ALL DRIVES for logged-in user's college
export const getDrives = async (req, res) => {
  try {
    const { branch, minCTC, jobType, active } = req.query;

    const filter = { collegeId: req.user.collegeId };

    if (active !== "false") filter.isActive = true;
    if (minCTC)  filter.ctcOffered = { $gte: Number(minCTC) };
    if (branch)  filter["eligibility.branches"] = { $in: [branch] };
    if (jobType) filter.jobType = jobType.toUpperCase();

    const drives = await Drive.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    // For students — attach per-drive eligibility and applied status
    if (req.user.role === "STUDENT") {
      const appliedDriveIds = await Application.find({
        studentId: req.user._id
      }).distinct("driveId");

      const appliedSet = new Set(appliedDriveIds.map(id => id.toString()));

      const drivesWithStatus = drives.map(drive => {
        const d = drive.toObject();
        d.alreadyApplied    = appliedSet.has(drive._id.toString());
        d.eligibilityCheck  = checkEligibility(drive, req.user);
        return d;
      });

      return res.json(drivesWithStatus);
    }

    res.json(drives);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// SINGLE DRIVE
export const getDriveById = async (req, res) => {
  try {
    const drive = await Drive.findOne({
      _id: req.params.id,
      collegeId: req.user.collegeId
    }).populate("createdBy", "name email");

    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    // TPO also gets applicant count
    if (req.user.role === "TPO" || req.user.role === "ADMIN") {
      const applicantCount = await Application.countDocuments({ driveId: drive._id });
      const driveObj = drive.toObject();
      driveObj.applicantCount = applicantCount;
      return res.json(driveObj);
    }

    res.json(drive);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE DRIVE (TPO only)
export const updateDrive = async (req, res) => {
  try {
    const drive = await Drive.findOne({
      _id: req.params.id,
      collegeId: req.user.collegeId
    });

    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    const updatedDrive = await Drive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedDrive);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// SOFT DELETE DRIVE (TPO only)
export const deleteDrive = async (req, res) => {
  try {
    const drive = await Drive.findOne({
      _id: req.params.id,
      collegeId: req.user.collegeId
    });

    if (!drive) {
      return res.status(404).json({ message: "Drive not found" });
    }

    drive.isActive = false;
    await drive.save();

    res.json({ message: "Drive deactivated successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};