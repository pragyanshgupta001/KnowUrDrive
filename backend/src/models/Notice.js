import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({

  title: String,
  description: String,

  priority: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "MEDIUM"
  },

  attachments: [String],

  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College"
  },

  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

export default mongoose.model("Notice", noticeSchema);