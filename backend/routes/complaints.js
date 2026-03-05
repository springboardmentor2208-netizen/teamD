const router = require("express").Router();
const Complaint = require("../models/Complaint");
const AdminLog = require("../models/Admin");
const User = require("../models/User"); 
const { protect, adminOnly } = require("../middleware/auth.js");
const Vote = require("../models/Vote");


router.post("/", protect, async (req, res) => {
  try {
    const { title, description, photos, location_coords, address } = req.body;
    const complaint = await Complaint.create({
      user_id: req.user._id,
      title,
      description,
      photos,
      location_coords,
      address,
      status: "received"
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user_id", "fullName email profilePhoto")
      .populate("assigned_to", "fullName")
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      complaints.map(async c => {
        const upvotes = await Vote.countDocuments({ complaint_id: c._id, vote_type: "upvote" });
        const downvotes = await Vote.countDocuments({ complaint_id: c._id, vote_type: "downvote" });
        return { ...c.toObject(), upvotes, downvotes };
      })
    );
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


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


router.get("/volunteers", protect, adminOnly, async (req, res) => {
  try {
    const volunteers = await User.find({ role: "volunteer" }).select("fullName _id");
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching volunteers" });
  }
});


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


router.put("/:id/assign", protect, adminOnly, async (req, res) => {
  try {
    const { volunteerId } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assigned_to: volunteerId, status: "in_review" },
      { new: true }
    );
    await AdminLog.create({
      action: `Assigned complaint to volunteer ${volunteerId}`,
      user_id: req.user.id
    });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: "Assignment failed" });
  }
});


router.put("/:id/resolve", protect, async (req, res) => {
  try {
    const { remarks } = req.body;
    const complaint = await Complaint.findOneAndUpdate(
      { _id: req.params.id, assigned_to: req.user._id },
      { status: "resolved", remarks: remarks },
      { new: true }
    );
    if (!complaint) return res.status(403).json({ message: "Unauthorized" });
    res.json({ message: "Resolved successfully", complaint });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;