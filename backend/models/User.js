const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: String,
  password: { type: String, required: true },
  location: String,
  role: {
  type: String,
  enum: ["user", "volunteer", "admin"],
  default: "user"
},
  profilePhoto: String
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);
