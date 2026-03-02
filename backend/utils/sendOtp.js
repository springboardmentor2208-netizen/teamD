const nodemailer = require("nodemailer");

module.exports = async (email, otp) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: "CleanStreet <noreply@cleanstreet.com>",
    to: email,
    subject: "Password Reset OTP",
    html: `
      <h2>Your OTP for CleanStreet reseting Password</h2>
      <h1>${otp}</h1>
      <p>If you did not request this, please ignore this email.</p>
      <p>Do not share this OTP with anyone.</p>
      <p>Expires in 10 minutes</p>
    `
  });
};