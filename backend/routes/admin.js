const router = require("express").Router();
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const AdminLog = require("../models/Admin");
const { protect, adminOnly } = require("../middleware/auth.js");

// 1. DASHBOARD STATS (For the Bar Graph)
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const received = await Complaint.countDocuments({ status: "received" });
    const inReview = await Complaint.countDocuments({ status: "in_review" });
    const resolved = await Complaint.countDocuments({ status: "resolved" });

    res.json({
      totalUsers,
      totalComplaints: received + inReview + resolved,
      received,
      inReview,
      resolved
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// 2. USER MANAGEMENT
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.put("/users/:id/role", protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Role update failed" });
  }
});

router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// 3. COMPLAINT MANAGEMENT & VOLUNTEERS
router.get("/volunteers", protect, adminOnly, async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" }).select("fullName _id");
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching volunteers" });
  }
});

router.put("/assign/:id", protect, adminOnly, async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assigned_to: volunteerId, status: "in_review" },
      { new: true }
    ).populate("assigned_to", "fullName");
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Assignment failed" });
  }
});

router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const email = user.email;
    await User.findByIdAndDelete(req.params.id);

    // Trigger mock email
    console.log(`[ALERT] Automated email sent to: ${email}. Reason: Account deleted by Admin.`);
    // Here you would integrate Nodemailer: await sendDeletionEmail(email);

    res.json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Delete operation failed" });
  }
});

module.exports = router;