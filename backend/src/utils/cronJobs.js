import cron from "node-cron";
import User from "../models/User.js";
import Drive from "../models/Drive.js";
import { sendWeeklyDigest } from "../services/emailService.js";



// WEEKLY EMAIL DIGEST — every Monday at 8:00 AM
export const startWeeklyDigest = () => {
  cron.schedule("0 8 * * 1", async () => {
    console.log("Running weekly digest job...");

    try {
      // Get all active students grouped by college
      const students = await User.find({ role: "STUDENT", isActive: true });

      for (const student of students) {
        const drives = await Drive.find({
          collegeId: student.collegeId,
          isActive: true,
          deadline: { $gte: new Date() }
        }).select("companyName role ctcOffered deadline jobType");

        await sendWeeklyDigest(student, drives);
      }

      console.log(`Weekly digest sent to ${students.length} students`);

    } catch (error) {
      console.error("Weekly digest error:", error.message);
    }
  }, {timezone: "Asia/Kolkata"});
};


// ─── AUTO-CLOSE DRIVES past deadline — every day at midnight
export const startAutoCloseDrives = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running auto-close drives job...");

    try {
      const result = await Drive.updateMany(
        {
          deadline: { $lt: new Date() },
          isActive: true
        },
        { isActive: false }
      );

      console.log(`Auto-closed ${result.modifiedCount} expired drives`);

    } catch (error) {
      console.error("Auto-close drives error:", error.message);
    }
  });
};


// ─── START ALL CRON JOBS — call this from server.js ──────────────────────────
export const startAllCronJobs = () => {
  startWeeklyDigest();
  startAutoCloseDrives();
  console.log("All cron jobs started");
};