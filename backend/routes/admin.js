const router = require("express").Router();
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const AdminLog = require("../models/Admin");
const { protect, adminOnly } = require("../middleware/auth.js");



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

router.get("/volunteers", protect, adminOnly, async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" }).select("fullName _id");
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching volunteers" });
  }
});

router.put("/:id/assign", protect, adminOnly, async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        assigned_to: volunteerId,
        status: "in_review" // Automatically move to in_review when assigned
      },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Assignment failed" });
  }
});

module.exports = router;
