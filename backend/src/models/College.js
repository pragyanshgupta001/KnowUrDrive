import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "College name is required"],
    trim: true
  },

  code: {
    // Unique code students use at signup "ZHCET2026"
    type: String,
    required: [true, "College code is required"],
    unique: true,
    uppercase: true,
    trim: true
  },

  domain: {
    type: String,
    trim: true   // "amu.ac.in" - for email auto-verification
  },

  address: {
    type: String,
    trim: true
  },

  // Approved TPO accounts for particular college
  approvedTPOs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  // Link to particular college's placement policy
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Policy",
    default: null
  },

  // TOP crendentials
  tpoRequest: {
    name:  { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    dob:   { type: String }, // format: YYYY-MM-DD
    phone: { type: String, trim: true }
  },

  // Admin approval (approving new colleges joining the platform)
  isApproved: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("College", collegeSchema);