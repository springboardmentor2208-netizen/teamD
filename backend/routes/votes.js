const router = require("express").Router();
const Vote = require("../models/Vote");
const { protect } = require("/Users/jimin/Documents/infosys/Civic-Issue-Project/backend/middleware/auth..js");



router.post("/", protect, async (req, res) => {
  const { complaint_id, vote_type } = req.body;

  const existing = await Vote.findOne({
    user_id: req.user.id,
    complaint_id
  });

  if (existing) {
    existing.vote_type = vote_type;
    await existing.save();
    return res.json(existing);
  }

  const vote = await Vote.create({
    user_id: req.user.id,
    complaint_id,
    vote_type
  });

  res.status(201).json(vote);
});



router.get("/:complaintId", async (req, res) => {
  const upvotes = await Vote.countDocuments({
    complaint_id: req.params.complaintId,
    vote_type: "upvote"
  });

  const downvotes = await Vote.countDocuments({
    complaint_id: req.params.complaintId,
    vote_type: "downvote"
  });

  res.json({ upvotes, downvotes });
});

module.exports = router;
