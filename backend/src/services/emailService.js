import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"KnowUrDrive Platform" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
  } catch (error) {
    // Log but don't crash the main request if email fails
    console.error("Email send error:", error.message);
  }
};


// NEW DRIVE ALERT (sent to all eligible students)
export const sendDriveAlert = async (student, drive) => {
  await sendMail({
    to: student.email,
    subject: `New Placement Drive: ${drive.companyName} — ${drive.role}`,
    html: `
      <h2>New Drive Posted</h2>
      <p>Hi ${student.name},</p>
      <p>A new placement drive has been posted that you may be eligible for:</p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td><strong>Company</strong></td><td>${drive.companyName}</td></tr>
        <tr><td><strong>Role</strong></td><td>${drive.role}</td></tr>
        <tr><td><strong>CTC</strong></td><td>${drive.ctcOffered} LPA</td></tr>
        <tr><td><strong>Job Type</strong></td><td>${drive.jobType}</td></tr>
        <tr><td><strong>Deadline</strong></td><td>${drive.deadline ? new Date(drive.deadline).toDateString() : "Not specified"}</td></tr>
      </table>
      <br/>
      <p>Login to the platform to apply before the deadline.</p>
    `
  });
};


// APPLICATION STATUS UPDATE
export const sendStatusUpdate = async (student, drive, status, remarks) => {
  const statusMessages = {
    SHORTLISTED: "Congratulations! You have been shortlisted.",
    INTERVIEW:   "You have been moved to the interview round.",
    SELECTED:    "Congratulations! You have been selected!",
    REJECTED:    "Unfortunately, you have not been selected for this drive."
  };

  await sendMail({
    to: student.email,
    subject: `Application Update: ${drive.companyName} — ${status}`,
    html: `
      <h2>Application Status Update</h2>
      <p>Hi ${student.name},</p>
      <p>${statusMessages[status] || `Your status has been updated to: ${status}`}</p>
      <p><strong>Company:</strong> ${drive.companyName}</p>
      <p><strong>Role:</strong> ${drive.role}</p>
      ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ""}
      <br/>
      <p>Login to the platform to view your full application tracker.</p>
    `
  });
};


// WEEKLY DIGEST (sent every Monday via cronJobs)
export const sendWeeklyDigest = async (student, drives) => {
  if (!drives.length) return;

  const driveRows = drives.map(d => `
    <tr>
      <td>${d.companyName}</td>
      <td>${d.role}</td>
      <td>${d.ctcOffered} LPA</td>
      <td>${d.deadline ? new Date(d.deadline).toDateString() : "—"}</td>
    </tr>
  `).join("");

  await sendMail({
    to: student.email,
    subject: `Weekly Placement Digest — ${new Date().toDateString()}`,
    html: `
      <h2>This Week's Placement Drives</h2>
      <p>Hi ${student.name}, here are the active drives at your college:</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <thead>
          <tr style="background:#f0f0f0">
            <th align="left">Company</th>
            <th align="left">Role</th>
            <th align="left">CTC</th>
            <th align="left">Deadline</th>
          </tr>
        </thead>
        <tbody>${driveRows}</tbody>
      </table>
      <br/>
      <p>Login to apply before deadlines close.</p>
    `
  });
};


// WELCOME EMAIL (on student registration)
export const sendWelcomeEmail = async (student, collegeName) => {
  await sendMail({
    to: student.email,
    subject: "Welcome to KnowUrDrive!",
    html: `
      <h2>Welcome, ${student.name}!</h2>
      <p>Your account has been created successfully for <strong>${collegeName}</strong>.</p>
      <p>You can now log in to view placement drives, apply to companies, and track your applications.</p>
    `
  });
};