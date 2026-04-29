import College from "../models/College.js";
import Policy from "../models/Policy.js";


// REQUEST TO JOIN PLATFORM
export const requestCollegeRegistration = async (req, res) => {
  try {
    const { name, code, domain, address } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "College name and code are required" });
    }

    const exists = await College.findOne({ code: code.toUpperCase() });
    if (exists) {
      return res.status(400).json({ message: "A college with this code already exists" });
    }

    const college = await College.create({
      name,
      code: code.toUpperCase(),
      domain,
      address,
      isApproved: false    // admin must approve before students can register
    });

    res.status(201).json({
      message: "College registration request submitted. Wait for admin approval.",
      college
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