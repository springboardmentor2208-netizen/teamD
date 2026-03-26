const mongoose = require("mongoose");

const AdminLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  target_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  timestamp: { type: Date, default: Date.now }
});


module.exports = mongoose.models.AdminLog || mongoose.model("AdminLog", AdminLogSchema);