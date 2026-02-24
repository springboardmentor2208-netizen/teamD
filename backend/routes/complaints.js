const router = require("express").Router();
const Complaint = require("../models/Complaint");
const AdminLog = require("../models/Admin");
const { protect, adminOnly } = require("../middleware/auth.js");
const Vote = require("../models/Vote");


router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      description,
      photo,
      location_coords,
      address
    } = req.body;

    if (!title || !description || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const complaint = await Complaint.create({
      user_id: req.user.id,
      title,
      description,
      photo,
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
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      complaints.map(async c => {
        const upvotes = await Vote.countDocuments({
          complaint_id: c._id,
          vote_type: "upvote"
        });

        const downvotes = await Vote.countDocuments({
          complaint_id: c._id,
          vote_type: "downvote"
        });

        return {
          ...c.toObject(),
          upvotes,
          downvotes
        };
      })
    );

    res.json(enriched);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id/status", protect, adminOnly, async (req, res) => {
  const { status } = req.body;

  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  await AdminLog.create({
    action: `Updated complaint status to ${status}`,
    user_id: req.user.id
  });

  res.json(complaint);
});


router.put("/:id/assign", protect, adminOnly, async (req, res) => {
  const { assigned_to } = req.body;

  const complaint = await Complaint.findByIdAndUpdate(
    req.params.id,
    { assigned_to },
    { new: true }
  );

  await AdminLog.create({
    action: "Assigned complaint",
    user_id: req.user.id
  });

  res.json(complaint);
});

module.exports = router;
