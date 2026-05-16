const nodemailer = require("nodemailer");
require("dotenv").config()

console.log("EMAIL_USER:", process.env.EMAIL_USER);
 console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "set" : "missing");
const transporter = nodemailer.createTransport({
  service: "gmail", // or use SMTP config
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS  // your app password
  }
});

async function sendApprovalEmail(to, doctorName) {
  await transporter.sendMail({
    from: `"Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Doctor Account Approved",
    text: `Hello ${doctorName},\n\nYour account has been approved. You can now log in to the system.\n\nRegards,\nAdmin Team`,
    html: `<p>Hello <b>${doctorName}</b>,</p>
           <p>Your account has been <b>approved</b>. You can now log in to the system.</p>
           <p>Regards,<br/>Admin Team</p>`
  });
}

async function sendRejectEmail(to, doctorName,reason) {
  await transporter.sendMail({
    from: `"Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Doctor Account Rejected",
    text: `Hello ${doctorName},\n\nYour account has been Rejected.\n\nRegards,\nAdmin Team`,
    html: `<p>Hello <b>${doctorName}</b>,</p>
           <p>Your request has been <b>Rejected </b>${reason}</p>
           <p>Regards,<br/>Admin Team</p>`
  });
}

module.exports = { sendApprovalEmail,sendRejectEmail };
