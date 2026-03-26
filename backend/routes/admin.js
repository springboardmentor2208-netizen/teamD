const router = require("express").Router();
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Admin = require("../models/Admin");
const { protect, adminOnly } = require("../middleware/auth.js");
const AdminLog = require("../models/AdminLog");

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

router.get("/logs", protect, adminOnly, async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate("admin_id", "fullName") // This brings in the Admin's Name
      .sort({ timestamp: -1 });         // Newest first
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching logs" });
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
    const targetUser = await User.findById(req.params.id);
    
    await User.findByIdAndUpdate(req.params.id, { role });

    
    await new AdminLog({
      action: `Updated ${targetUser.fullName} to ${role.toUpperCase()}`,
      admin_id: req.user._id, 
      target_id: targetUser._id
    }).save();

    res.json({ message: "Role updated and logged" });
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const targetUser = await User.findByIdAndDelete(req.params.id);

    await new AdminLog({
      action: `Deleted ${targetUser.fullName}`,
      admin_id: req.user._id, 
      target_id: targetUser._id
    }).save();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});


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

  
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

   
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assigned_to: volunteerId, status: "in_review" },
      { new: true }
    ).populate("assigned_to", "fullName");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    
    await new AdminLog({
      action: `Assigned complaint "${complaint.title}" to ${volunteer.fullName}`,
      admin_id: req.user._id, 
      target_id: volunteerId  
    }).save();

    res.json(complaint);
  } catch (err) {
    console.error("Assignment Error:", err);
    res.status(500).json({ message: "Assignment failed" });
  }
});
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const email = user.email;
    await User.findByIdAndDelete(req.params.id);

   
    console.log(`[ALERT] Automated email sent to: ${email}. Reason: Account deleted by Admin.`);
   

    res.json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Delete operation failed" });
  }
});

module.exports = router;