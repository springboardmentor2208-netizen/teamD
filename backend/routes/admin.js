const router = require("express").Router();
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const AdminLog = require("../models/AdminLog");
const { protect, adminOnly } = require("../middleware/auth.js");

// 1. DASHBOARD STATS
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const received = await Complaint.countDocuments({ status: "received" });
    const inReview = await Complaint.countDocuments({ status: "in_review" });
    const resolved = await Complaint.countDocuments({ status: "resolved" });
    res.json({ totalUsers, totalComplaints: received + inReview + resolved, received, inReview, resolved });
  } catch (err) { res.status(500).json({ message: "Error fetching stats" }); }
});

// 2. FETCH LOGS
router.get("/logs", protect, adminOnly, async (req, res) => {
  try {
    const logs = await AdminLog.find().populate("admin_id", "fullName").sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) { res.status(500).json({ message: "Error fetching logs" }); }
});

// 3. USER MANAGEMENT
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: "Error fetching users" }); }
});

router.put("/users/:id/role", protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

   
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { returnDocument: 'after' });

    await new AdminLog({
      action: `Updated ${targetUser.fullName} to ${role.toUpperCase()}`,
      admin_id: req.user._id, 
      target_id: targetUser._id
    }).save();

    res.json(updatedUser);
  } catch (err) { res.status(500).json({ message: "Update failed" }); }
});

// FIXED: Removed duplicate delete route and merged logic
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { email, fullName, _id } = user;
    
    // Log before deleting so we have the ID reference
    await new AdminLog({
      action: `Deleted account: ${fullName}`,
      admin_id: req.user._id, 
      target_id: _id
    }).save();

    await User.findByIdAndDelete(req.params.id);
    console.log(`[ALERT] Automated email sent to: ${email}. Reason: Account deleted by Admin.`);

    res.json({ message: "User deleted successfully." });
  } catch (err) { res.status(500).json({ message: "Delete operation failed" }); }
});

// 4. VOLUNTEER & ASSIGNMENT
router.get("/volunteers", protect, adminOnly, async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" }).select("fullName _id");
    res.json(volunteers);
  } catch (err) { res.status(500).json({ message: "Error fetching volunteers" }); }
});

router.put("/assign/:id", protect, adminOnly, async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assigned_to: volunteerId, status: "in_review" },
      { returnDocument: 'after' }
    ).populate("assigned_to", "fullName");

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    await new AdminLog({
      action: `Assigned complaint "${complaint.title}" to ${volunteer.fullName}`,
      admin_id: req.user._id, 
      target_id: volunteerId  
    }).save();

    res.json(complaint);
  } catch (err) { res.status(500).json({ message: "Assignment failed" }); }
});

module.exports = router;