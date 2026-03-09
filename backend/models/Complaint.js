const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  photos: [String],
  location_coords: { lat: Number, lng: Number },
  address: String,
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: { type: String, enum: ["received", "in_review", "resolved"], default: "received" },
  remarks: { type: String, default: "" }
}, { 
  timestamps: true,
  toJSON: { virtuals: true }, 
  toObject: { virtuals: true } 
});


complaintSchema.virtual('comments', {
  ref: 'Comment',              
  localField: '_id',            
  foreignField: 'complaint_id'  
});

complaintSchema.virtual('upvotes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'complaint_id',
  count: true, 
  match: { vote_type: 'upvote' } 
});


complaintSchema.virtual('downvotes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'complaint_id',
  count: true,
  match: { vote_type: 'downvote' }
});

module.exports = mongoose.model("Complaint", complaintSchema);