import mongoose from "mongoose";

const policySchema = new mongoose.Schema({

  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College"
  },

  minCTCMultiplier: {
    type: Number,
    default: 1.7
  },

  maxOffersAllowed: {
    type: Number,
    default: 3
  },

  allowMultipleOffers: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Policy", policySchema);