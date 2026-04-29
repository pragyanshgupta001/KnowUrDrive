import Policy from "../models/Policy.js";
import College from "../models/College.js";

export const checkEligibility = (drive, student) => {
  const reasons = [];

  // Branch check
  if (
    drive.eligibility?.branches?.length &&
    !drive.eligibility.branches.includes(student.department)
  ) {
    reasons.push(
      `Branch not eligible. Open for: ${drive.eligibility.branches.join(", ")}`
    );
  }

  // CGPA check
  if (
    drive.eligibility?.minCGPA &&
    (student.cgpa === null || student.cgpa === undefined || student.cgpa < drive.eligibility.minCGPA)
  ) {
    reasons.push(
      `Minimum CGPA required: ${drive.eligibility.minCGPA}. Your CGPA: ${student.cgpa ?? "not set"}`
    );
  }

  return {
    eligible: reasons.length === 0,
    reasons
  };
};


export const checkPlacementLock = async (student, drive) => {
  // Unplaced students are never locked
  if (student.placementStatus === "UNPLACED") {
    return { locked: false, reason: null, detail: null };
  }

  const college = await College.findById(student.collegeId).populate("policyId");
  const multiplier = college?.policyId?.minCTCMultiplier ?? 1.0;
  const minCTC = student.currentOfferCTC * multiplier;

  if (drive.ctcOffered < minCTC) {
    return {
      locked: true,
      reason: "Your current offer CTC exceeds the threshold for this drive.",
      detail: {
        yourOffer: `${student.currentOfferCTC} LPA`,
        driveOffer: `${drive.ctcOffered} LPA`,
        minimumRequired: `${minCTC.toFixed(2)} LPA`,
        multiplier
      }
    };
  }

  return { locked: false, reason: null, detail: null };
};