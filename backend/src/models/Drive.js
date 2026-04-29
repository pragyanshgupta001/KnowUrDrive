import mongoose from "mongoose";

const driveSchema = new mongoose.Schema({

  companyName: {
    type: String,
    required: [true, "Company name is required"],
    trim: true
  },

  role: {
    type: String,
    required: [true, "Job role is required"],
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  ctcOffered: {
    type: Number,
    required: [true, "CTC is required"]   // in LPA
  },

  ctcType: {
    type: String,
    enum: ["FIXED", "UPTO"],
    default: "FIXED"
  },

  eligibility: {
    branches: [String],
    minCGPA: { type: Number, default: 0 },
    backlogAllowed: { type: Boolean, default: false },
    maxBacklogs: { type: Number, default: 0 }
  },

  driveDate: Date,
  deadline: Date,

  selectionProcess: [String],

  jobLocation: {
    type: String,
    trim: true
  },

  jobType: {
    type: String,
    enum: ["FULL_TIME", "INTERNSHIP", "PPO"],
    default: "FULL_TIME"
  },

  attachments: [String],                  // JD PDF URLs from Cloudinary

  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Drive", driveSchema);