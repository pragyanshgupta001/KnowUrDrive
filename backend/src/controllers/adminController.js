import User from "../models/User.js";
import College from "../models/College.js";
import Policy from "../models/Policy.js";
import Drive from "../models/Drive.js";
import bcrypt from "bcryptjs";
import { sendTPOWelcome } from "../services/emailService.js";

// Shared TPO creation logic (used on college approval + admin create form)
async function createTPOAccount({ name, email, dob, collegeId, collegeName }) {
  const normalizedEmail = email.toLowerCase();

  const existingCollegeTPO = await User.findOne({
    collegeId,
    role: "TPO",
    isActive: true
  });

  if (existingCollegeTPO) {
    return {
      created: false,
      reason: "TPO_ALREADY_EXISTS",
      message: "A TPO account already exists for this college."
    };
  }

  const emailInUse = await User.findOne({ email: normalizedEmail });
  if (emailInUse) {
    return {
      created: false,
      reason: "EMAIL_IN_USE",
      message: `Email ${normalizedEmail} is already registered on the platform.`
    };
  }

  const tpo = await User.create({
    name,
    email: normalizedEmail,
    password: await bcrypt.hash(dob, 10),
    role: "TPO",
    collegeId,
    isVerified: true,
    isActive: true,
    isPrimary: true,
    isFirstLogin: true
  });

  await College.findByIdAndUpdate(collegeId, {
    $addToSet: { approvedTPOs: tpo._id }
  });

  sendTPOWelcome(tpo, collegeName).catch((err) =>
    console.error("TPO welcome email failed:", err.message)
  );

  return {
    created: true,
    reason: "CREATED",
    message: `TPO account created for ${normalizedEmail}. Welcome email sent.`,
    tpo
  };
}

async function createTPOFromCollegeRequest(college) {
  const { name, email, dob } = college.tpoRequest || {};

  if (!name || !email || !dob) {
    return {
      created: false,
      reason: "NO_TPO_REQUEST",
      message: "No TPO details found on this college request. Create TPO manually from Create TPO."
    };
  }

  return createTPOAccount({
    name,
    email,
    dob,
    collegeId: college._id,
    collegeName: college.name
  });
}

// PLATFORM OVERVIEW
export const getPlatformStats = async (req, res) => {
  try {
    const [totalColleges, approvedColleges, totalStudents, totalTPOs, totalDrives] =
      await Promise.all([
        College.countDocuments(),
        College.countDocuments({ isApproved: true }),
        User.countDocuments({ role: "STUDENT" }),
        User.countDocuments({ role: "TPO" }),
        Drive.countDocuments()
      ]);

    res.json({
      totalColleges,
      approvedColleges,
      pendingColleges: totalColleges - approvedColleges,
      totalStudents,
      totalTPOs,
      totalDrives
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ALL COLLEGES
export const getAllColleges = async (req, res) => {
  try {
    const { approved } = req.query;

    const filter = {};
    if (approved === "true")  filter.isApproved = true;
    if (approved === "false") filter.isApproved = false;

    const colleges = await College.find(filter)
      .populate("approvedTPOs", "name email isPrimary isActive")
      .populate("policyId")
      .sort({ createdAt: -1 });

    res.json(colleges);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// APPROVE / REJECT COLLEGE — auto-creates TPO from tpoRequest when approved
export const updateCollegeApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const college = await College.findById(req.params.collegeId);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    college.isApproved = Boolean(isApproved);
    await college.save();

    let tpoProvision = null;

    if (college.isApproved) {
      if (!college.policyId) {
        const policy = await Policy.create({
          collegeId: college._id,
          minCTCMultiplier: 1.7,
          maxOffersAllowed: 3,
          allowMultipleOffers: true
        });
        college.policyId = policy._id;
        await college.save();
      }

      const freshCollege = await College.findById(college._id);
      tpoProvision = await createTPOFromCollegeRequest(freshCollege);
    }

    const updatedCollege = await College.findById(college._id)
      .populate("approvedTPOs", "name email isPrimary isActive");

    const baseMessage = college.isApproved ? "College approved" : "College approval revoked";
    const message = tpoProvision && college.isApproved
      ? `${baseMessage}. ${tpoProvision.message}`
      : baseMessage;

    res.json({
      message,
      college: updatedCollege,
      tpoProvision
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// REGISTER A NEW COLLEGE (admin direct — already approved, no TPO auto-create)
export const registerCollege = async (req, res) => {
  try {
    const { name, code, domain, address } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "College name and code are required" });
    }

    const exists = await College.findOne({ code: code.toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: "College code already exists" });
    }

    const policy = await Policy.create({
      minCTCMultiplier: 1.7,
      maxOffersAllowed: 3,
      allowMultipleOffers: true
    });

    const college = await College.create({
      name,
      code: code.toUpperCase(),
      domain,
      address,
      isApproved: true,
      policyId: policy._id
    });

    await Policy.findByIdAndUpdate(policy._id, { collegeId: college._id });

    res.status(201).json(college);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// CREATE TPO — manual form OR from stored college tpoRequest (fromRequest: true)
export const createTPO = async (req, res) => {
  try {
    const { name, email, collegeId, dob, fromRequest } = req.body;

    if (!collegeId) {
      return res.status(400).json({ message: "College is required" });
    }

    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    if (!college.isApproved) {
      return res.status(400).json({ message: "Approve the college before creating a TPO account" });
    }

    let result;

    if (fromRequest) {
      result = await createTPOFromCollegeRequest(college);
    } else {
      if (!name || !email || !dob) {
        return res.status(400).json({ message: "Name, email, college and DOB are required" });
      }

      const existingTPOCount = await User.countDocuments({
        collegeId,
        role: "TPO",
        isActive: true
      });

      result = await createTPOAccount({
        name,
        email,
        dob,
        collegeId,
        collegeName: college.name
      });

      // Manual add: only first TPO is primary; if college already has TPO, mark as non-primary
      if (result.created && existingTPOCount > 0) {
        await User.findByIdAndUpdate(result.tpo._id, { isPrimary: false });
        result.tpo.isPrimary = false;
      }
    }

    if (!result.created) {
      return res.status(result.reason === "EMAIL_IN_USE" ? 409 : 400).json(result);
    }

    res.status(201).json({
      _id: result.tpo._id,
      name: result.tpo.name,
      email: result.tpo.email,
      role: result.tpo.role,
      isPrimary: result.tpo.isPrimary,
      collegeId: result.tpo.collegeId,
      message: result.message
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// UPDATE COLLEGE POLICY
export const updateCollegePolicy = async (req, res) => {
  try {
    const { minCTCMultiplier, maxOffersAllowed, allowMultipleOffers } = req.body;

    const college = await College.findById(req.params.collegeId);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    if (minCTCMultiplier !== undefined && minCTCMultiplier < 1) {
      return res.status(400).json({ message: "minCTCMultiplier must be >= 1" });
    }

    const policy = await Policy.findOneAndUpdate(
      { collegeId: req.params.collegeId },
      { minCTCMultiplier, maxOffersAllowed, allowMultipleOffers },
      { new: true, upsert: true }
    );

    res.json(policy);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// TOGGLE USER ACTIVE STATUS
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User ${user.isActive ? "activated" : "deactivated"}`,
      isActive: user.isActive
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
