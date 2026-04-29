import User from "../models/User.js";
import College from "../models/College.js";
import Policy from "../models/Policy.js";
import Drive from "../models/Drive.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";


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
      .populate("approvedTPOs", "name email")
      .populate("policyId")
      .sort({ createdAt: -1 });

    res.json(colleges);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// APPROVE / REJECT COLLEGE
export const updateCollegeApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const college = await College.findByIdAndUpdate(
      req.params.collegeId,
      { isApproved },
      { new: true }
    );

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json({
      message: isApproved ? "College approved" : "College rejected",
      college
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// REGISTER A NEW COLLEGE
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

    // Create default policy for this college
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

    // Update policy with collegeId
    await Policy.findByIdAndUpdate(policy._id, { collegeId: college._id });

    res.status(201).json(college);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// CREATE TPO ACCOUNT
export const createTPO = async (req, res) => {
  try {
    const { name, email, password, collegeId } = req.body;

    if (!name || !email || !password || !collegeId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const tpo = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "TPO",
      collegeId,
      isVerified: true
    });

    await College.findByIdAndUpdate(collegeId, {
      $addToSet: { approvedTPOs: tpo._id }
    });

    res.status(201).json({
      _id: tpo._id,
      name: tpo.name,
      email: tpo.email,
      role: tpo.role,
      token: generateToken(tpo._id)
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