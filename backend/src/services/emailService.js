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

// Welcome email sent to tpo when approved by admin. Contains login credentials.
export const sendTPOWelcome = async (tpo, collegeName) => {
  await sendMail({
    to: tpo.email,
    subject: `Your KnowUrDrive TPO account is ready — ${collegeName}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
        <h2 style="color:#6c63ff">Welcome to KnowUrDrive, ${tpo.name}!</h2>
        <p>Your college <strong>${collegeName}</strong> has been approved on the KnowUrDrive platform.</p>
        <p>Your TPO coordinator account is ready. Use the following credentials to log in:</p>
 
        <table style="border-collapse:collapse;margin:20px 0;width:100%">
          <tr>
            <td style="padding:10px 16px;background:#f5f5f5;font-weight:600;width:120px">Email</td>
            <td style="padding:10px 16px;background:#fafafa">${tpo.email}</td>
          </tr>
          <tr>
            <td style="padding:10px 16px;background:#f5f5f5;font-weight:600">Password</td>
            <td style="padding:10px 16px;background:#fafafa">
              Your date of birth in <strong>YYYY-MM-DD</strong> format<br/>
              <span style="color:#888;font-size:12px">e.g. if born 15 Aug 1990 → 1990-08-15</span>
            </td>
          </tr>
        </table>
 
        <p>
          <a href="${process.env.CLIENT_URL}/login"
            style="background:#6c63ff;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">
            Log in to KnowUrDrive
          </a>
        </p>
 
        <p style="color:#e53e3e;font-size:13px;margin-top:20px">
          ⚠️ You will be asked to change your password immediately after your first login.
        </p>
 
        <p style="color:#888;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:16px">
          If you didn't request this, please contact us at ${process.env.EMAIL_USER}
        </p>
      </div>
    `
  });
};
 
// Sent when an existing TPO adds a new TPO to their college.
export const sendTPOAdded = async (newTpo, collegeName, addedByName) => {
  await sendMail({
    to: newTpo.email,
    subject: `You've been added as TPO for ${collegeName} on KnowUrDrive`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
        <h2 style="color:#6c63ff">Hello ${newTpo.name}!</h2>
        <p>
          <strong>${addedByName}</strong> has added you as a TPO coordinator for
          <strong>${collegeName}</strong> on KnowUrDrive.
        </p>
        <p>Use the following credentials to log in:</p>
 
        <table style="border-collapse:collapse;margin:20px 0;width:100%">
          <tr>
            <td style="padding:10px 16px;background:#f5f5f5;font-weight:600;width:120px">Email</td>
            <td style="padding:10px 16px;background:#fafafa">${newTpo.email}</td>
          </tr>
          <tr>
            <td style="padding:10px 16px;background:#f5f5f5;font-weight:600">Password</td>
            <td style="padding:10px 16px;background:#fafafa">
              Your date of birth in <strong>YYYY-MM-DD</strong> format<br/>
              <span style="color:#888;font-size:12px">e.g. if born 15 Aug 1990 → 1990-08-15</span>
            </td>
          </tr>
        </table>
 
        <p>
          <a href="${process.env.CLIENT_URL}/login"
            style="background:#6c63ff;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600">
            Log in to KnowUrDrive
          </a>
        </p>
 
        <p style="color:#e53e3e;font-size:13px;margin-top:20px">
          ⚠️ You will be asked to change your password immediately after your first login.
        </p>
      </div>
    `
  });
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