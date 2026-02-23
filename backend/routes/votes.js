const router = require("express").Router();
const Vote = require("../models/Vote");
const { protect } = require("../middleware/auth");

// Create or update vote
router.post("/:complaintId", protect, async (req, res) => {
  try {
    const { vote_type } = req.body;

    if (!["upvote", "downvote"].includes(vote_type)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const vote = await Vote.findOneAndUpdate(
      {
        user_id: req.user.id,
        complaint_id: req.params.complaintId
      },
      { vote_type },
      { upsert: true, new: true }
    );

    res.json(vote);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Get vote count for complaint
router.get("/:complaintId", async (req, res) => {
  try {
    const upvotes = await Vote.countDocuments({
      complaint_id: req.params.complaintId,
      vote_type: "upvote"
    });

    const downvotes = await Vote.countDocuments({
      complaint_id: req.params.complaintId,
      vote_type: "downvote"
    });

    res.json({ upvotes, downvotes });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;