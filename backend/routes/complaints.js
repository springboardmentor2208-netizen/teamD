const router = require("express").Router();
const Complaint = require("../models/Complaint");
const AdminLog = require("../models/Admin");
const User = require("../models/User"); 
const { protect, adminOnly } = require("../middleware/auth.js");
const Vote = require("../models/Vote");
const Comment = require("../models/Comment");

// --- CREATE COMPLAINT (Auto-Assignment Logic) ---
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, photos, location_coords, address, zone } = req.body;

    // Safety fallback for zone
    const reportZone = zone || "Central";

    // 1. Find a volunteer in the same zone with the fewest tasks
    const availableVolunteer = await User.findOne({ 
      role: "volunteer", 
      zone: reportZone 
    }).sort({ activeTasks: 1 }); 

    const complaintData = {
      user_id: req.user._id,
      title,
      description,
      photos,
      location_coords,
      address,
      zone: reportZone, 
      // AUTO-ASSIGNED tasks get "assigned" status
      status: availableVolunteer ? "assigned" : "received",
      assigned_to: availableVolunteer ? availableVolunteer._id : null
    };

    const complaint = await Complaint.create(complaintData);

    // 2. Increment task count for the auto-matched volunteer
    if (availableVolunteer) {
      await User.findByIdAndUpdate(availableVolunteer._id, { 
        $inc: { activeTasks: 1 } 
      });
    }

    res.status(201).json(complaint);
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Failed to register complaint: " + err.message });
  }
});

// --- GET ALL COMPLAINTS ---
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user_id", "fullName") 
      .populate("assigned_to", "fullName") 
      .populate("upvotes")    
      .populate("downvotes")  
      .populate({
        path: 'comments',
        populate: { path: 'user_id', select: 'fullName' } 
      })
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- GET RESIDENT'S OWN COMPLAINTS ---
router.get("/my-complaints", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user_id: req.user._id })
      .populate("user_id", "fullName")
      .populate("assigned_to", "fullName")
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// --- GET VOLUNTEER LIST (Admin Only) ---
router.get("/volunteers", protect, adminOnly, async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" }).select("fullName _id zone activeTasks");
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching volunteers" });
  }
});

// --- GET TASKS ASSIGNED TO LOGGED-IN VOLUNTEER ---
router.get("/volunteer-tasks", protect, async (req, res) => {
  try {
    const tasks = await Complaint.find({ assigned_to: req.user._id })
      .populate("user_id", "fullName")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// --- MANUAL ADMIN ASSIGNMENT ---
router.put("/:id/assign", protect, adminOnly, async (req, res) => {
  try {
    const { volunteerId } = req.body;
    
    // MANUAL-ASSIGNED tasks get "in_review" status for the Dashboard Chart
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assigned_to: volunteerId, status: "in_review" },
      { new: true }
    );

    // Increment task count for the manually assigned volunteer
    await User.findByIdAndUpdate(volunteerId, { 
      $inc: { activeTasks: 1 } 
    });

    await AdminLog.create({
      action: `Assigned complaint ${req.params.id} to volunteer ${volunteerId}`,
      admin_id: req.user.id // Fixed field name to match your log model
    });

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Assignment failed" });
  }
});

// --- RESOLVE COMPLAINT ---
router.put("/:id/resolve", protect, async (req, res) => {
  try {
    const { remarks } = req.body;
    const complaint = await Complaint.findOneAndUpdate(
      { _id: req.params.id, assigned_to: req.user._id },
      { status: "resolved", remarks: remarks },
      { new: true }
    );
    
    if (!complaint) return res.status(403).json({ message: "Unauthorized or Complaint not found" });

    // Decrement workload when resolved
    await User.findByIdAndUpdate(req.user._id, { $inc: { activeTasks: -1 } });

    res.json({ message: "Resolved successfully", complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- DELETE COMMENT ---
router.delete("/comment/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    
    if (comment.user_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment removed" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// --- DELETE COMPLAINT ---
router.delete("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    if (complaint.user_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Comment.deleteMany({ complaint_id: req.params.id });
    await Vote.deleteMany({ complaint_id: req.params.id });
    
    // If deleted before resolution, decrement the volunteer's task count
    if (complaint.assigned_to && complaint.status !== "resolved") {
        await User.findByIdAndUpdate(complaint.assigned_to, { $inc: { activeTasks: -1 } });
    }

    await complaint.deleteOne();
    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
});

module.exports = router;