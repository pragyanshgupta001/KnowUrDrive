import College from "../models/College.js";
import Policy from "../models/Policy.js";
import User from "../models/User.js";


// REQUEST TO JOIN PLATFORM
export const requestCollegeRegistration = async (req, res) => {
  try {
    const { name, code, domain, address, tpoName, tpoEmail, tpoDob, tpoPhone } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "College name and code are required" });
    }

    if (!tpoName || !tpoEmail || !tpoDob) {
      return res.status(400).json({ message: "Your name, email and date of birth are required" });
    }
 
    // Validate DOB format YYYY-MM-DD
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(tpoDob)) {
      return res.status(400).json({ message: "Date of birth must be in YYYY-MM-DD format" });
    }

    const exists = await College.findOne({ code: code.toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: "A college with this code already exists" });
    }

    const normalizedEmail = tpoEmail.toLowerCase();

    const emailTaken = await User.findOne({ email: normalizedEmail });
    if (emailTaken) {
      return res.status(400).json({ message: "This TPO email is already registered on the platform" });
    }

    const college = await College.create({
      name,
      code: code.toUpperCase(),
      domain,
      address,
      isApproved: false,
      tpoRequest: {
        name:  tpoName.trim(),
        email: normalizedEmail,
        dob:   tpoDob,
        phone: tpoPhone?.trim() || ""
      }
    });

    const saved = await College.findById(college._id).select("name code tpoRequest isApproved");
    if (!saved?.tpoRequest?.email) {
      return res.status(500).json({ message: "Failed to save TPO details. Please try again." });
    }

    res.status(201).json({
      message: "College registration request submitted. The TPO will receive login details once approved.",
      college: saved
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET ALL APPROVED COLLEGES
export const getApprovedColleges = async (req, res) => {
  try {
    const colleges = await College.find({ isApproved: true })
      .select("name code domain address")
      .sort({ name: 1 });

    res.json(colleges);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE COLLEGE by code
export const getCollegeByCode = async (req, res) => {
  try {
    const college = await College.findOne({
      code: req.params.code.toUpperCase(),
      isApproved: true
    }).select("name code domain address");

    if (!college) {
      return res.status(404).json({ message: "Invalid or unapproved college code" });
    }

    res.json(college);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};