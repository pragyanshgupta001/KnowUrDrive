import User from "../models/User.js";
import College from "../models/College.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";


// REGISTER (students only)
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, collegeCode, department, year, cgpa } = req.body;

    // Basic validation
    if (!name || !email || !password || !collegeCode) {
      return res.status(400).json({
        message: "Name, email, password and college code are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check email not already used
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Validate college code
    const college = await College.findOne({ code: collegeCode.toUpperCase() });
    if (!college) {
      return res.status(400).json({ message: "Invalid college code. Contact your TPO." });
    }
    if (!college.isApproved) {
      return res.status(400).json({ message: "Your college is not yet approved on this platform." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "STUDENT",     // always force STUDENT — never trust role from body
      collegeId: college._id,
      department,
      year,
      cgpa
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// REGISTER TPO
export const registerTPO = async (req, res) => {
  try {
    const { name, email, password, collegeId } = req.body;

    if (!name || !email || !password || !collegeId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const college = await College.findById(collegeId);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
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

    // Add TPO to college's approvedTPOs list
    await College.findByIdAndUpdate(collegeId, {
      $addToSet: { approvedTPOs: tpo._id }
    });

    res.status(201).json({
      _id: tpo._id,
      name: tpo.name,
      email: tpo.email,
      role: tpo.role,
      collegeId: tpo.collegeId,
      token: generateToken(tpo._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated. Contact admin." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      collegeId: user.collegeId,
      placementStatus: user.placementStatus,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET PROFILE
export const getMe = async (req, res) => {
  // req.user is already populated by protect middleware (password excluded)
  res.json(req.user);
};


// UPDATE PROFILE (student updates their own CGPA, resume, etc.)
export const updateProfile = async (req, res) => {
  try {
    const { name, department, year, cgpa, resumeUrl } = req.body;

    const allowedUpdates = { name, department, year, cgpa, resumeUrl };

    // Strip undefined fields
    Object.keys(allowedUpdates).forEach(
      key => allowedUpdates[key] === undefined && delete allowedUpdates[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// authController.js - add this function
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};