const router = require("express").Router();
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const AdminLog = require("../models/Admin");
const { protect, adminOnly } = require("/Users/jimin/Documents/infosys/teamD/backend/middleware/auth.js");



router.get("/stats", protect, adminOnly, async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalComplaints = await Complaint.countDocuments();
  const resolved = await Complaint.countDocuments({ status: "resolved" });

  res.json({
    totalUsers,
    totalComplaints,
    resolved
  });
});


router.get("/logs", protect, adminOnly, async (req, res) => {
  const logs = await AdminLog.find()
    .populate("user_id", "fullName")
    .sort({ createdAt: -1 });

  res.json(logs);
});

module.exports = router;
