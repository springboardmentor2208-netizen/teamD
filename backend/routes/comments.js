const router = require("express").Router();
const Comment = require("../models/Comment");
const { protect } = require("../middleware/auth.js");



router.post("/", protect, async (req, res) => {
  const { complaint_id, content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Comment required" });
  }

  const comment = await Comment.create({
    user_id: req.user.id,
    complaint_id,
    content
  });

  res.status(201).json(comment);
});



router.get("/:complaintId", async (req, res) => {
  const comments = await Comment.find({
    complaint_id: req.params.complaintId
  })
    .populate("user_id", "fullName profilePhoto")
    .sort({ createdAt: -1 });

  res.json(comments);
});

module.exports = router;
