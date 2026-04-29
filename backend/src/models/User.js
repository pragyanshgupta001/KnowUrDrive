import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },

  role: {
    type: String,
    enum: ["STUDENT", "TPO", "ADMIN"],
    default: "STUDENT"
  },

  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College"
  },

  // Student profile fields
  department: {
    type: String,
    trim: true
  },

  year: {
    type: Number,
    min: 1,
    max: 5
  },

  cgpa: {
    type: Number,
    min: 0,
    max: 10
  },

  resumeUrl: {
    type: String,
    default: null
  },

  // Placement lock fields
  placementStatus: {
    type: String,
    enum: ["UNPLACED", "OFFER_PENDING", "PLACED"],
    default: "UNPLACED"
  },

  currentOfferCTC: {
    type: Number,
    default: null   // in LPA
  },

  acceptedDriveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drive",
    default: null
  },

  // Account status
  isVerified: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("User", userSchema);