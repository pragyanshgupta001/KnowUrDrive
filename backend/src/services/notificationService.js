import User from "../models/User.js";
import { sendDriveAlert, sendStatusUpdate } from "./emailService.js";
import { checkEligibility } from "./eligibilityService.js";


// NOTIFY ELIGIBLE STUDENTS when a new drive is posted
// Called from tpoController after createDrive succeeds.

export const notifyNewDrive = async (drive) => {
  try {
    const students = await User.find({
      collegeId: drive.collegeId,
      role: "STUDENT",
      isActive: true
    });

    // Send email only to students who pass basic eligibility
    const emailPromises = students
      .filter(student => {
        const { eligible } = checkEligibility(drive, student);
        return eligible;
      })
      .map(student => sendDriveAlert(student, drive));

    await Promise.allSettled(emailPromises);

    console.log(`Drive notifications sent for: ${drive.companyName}`);

  } catch (error) {
    console.error("notifyNewDrive error:", error.message);
  }
};


// NOTIFY STUDENT when their application status changes
// Called from tpoController after updateApplicationStatus.

export const notifyStatusChange = async (student, drive, status, remarks) => {
  try {
    await sendStatusUpdate(student, drive, status, remarks);
  } catch (error) {
    console.error("notifyStatusChange error:", error.message);
  }
};