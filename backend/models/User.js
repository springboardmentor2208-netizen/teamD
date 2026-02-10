const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phoneNumber: { type: String, trim: true },
    password: { type: String, required: true, minlength: 6 },
    location: { type: String, trim: true, default: '' },
    bio: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
