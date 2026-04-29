import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  driveId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Drive",
    required: true
  },

  // Denormalised for fast queries — avoids Drive join just to filter by college
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true
  },

  status: {
    type: String,
    enum: ["APPLIED", "SHORTLISTED", "INTERVIEW", "SELECTED", "REJECTED"],
    default: "APPLIED"
  },

  // CTC at time of application — stored so history is preserved even if drive edits
  ctcAtApplication: {
    type: Number,
    required: true
  },

  // TPO notes when updating status
  remarks: {
    type: String,
    default: ""
  }

}, { timestamps: true });

// Prevent a student from applying to the same drive twice
applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);