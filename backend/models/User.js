const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  location: String,
  password: String,
  role: { type: String, default: "user" },
  profilePhoto: String,
  zone: { type: String, default: "General" }, 
  activeTasks: { type: Number, default: 0 },
  resetOTP: String,
  resetOTPExpire: Date

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);