const router = require("express").Router();
const Complaint = require("../models/Complaint");
const AdminLog = require("../models/Admin");
const User = require("../models/User"); 
const { protect, adminOnly } = require("../middleware/auth.js");
const Vote = require("../models/Vote");
const Comment = require("../models/Comment");

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
      .populate("user_id", "fullName")
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

//delete comment route
router.delete("/comment/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    
    if (comment.user_id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// --- DELETE COMPLAINT ROUTE ---
router.delete("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    
    const complaintOwnerId = complaint.user_id.toString();
    const loggedInUserId = req.user._id.toString();

    if (complaintOwnerId !== loggedInUserId) {
      return res.status(401).json({ 
        message: "Unauthorized: You did not create this complaint" 
      });
    }

    
    await Comment.deleteMany({ complaint_id: req.params.id });
    await Vote.deleteMany({ complaint_id: req.params.id });
    
    await complaint.deleteOne();
    res.json({ message: "Complaint deleted successfully" });
    
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error during deletion" });
  }
});

module.exports = router;