const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    complaint_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint"
    },

    vote_type: {
      type: String,
      enum: ["upvote", "downvote"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vote", voteSchema);
