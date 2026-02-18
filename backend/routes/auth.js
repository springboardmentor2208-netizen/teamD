const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      location,
      password,
      role,
      secretKey,
      profilePhoto
    } = req.body;

    if (!fullName || !email || !password || !location) {
      return res.status(400).json({ message: "Please enter all required fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    let finalRole = "user";

    if (role === "admin") {
      if (secretKey !== "ADMIN123") {
        return res.status(403).json({ message: "Invalid admin secret" });
      }
      finalRole = "admin";
    }

    if (role === "volunteer") finalRole = "volunteer";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      fullName,
      email,
      phoneNumber,
      location,
      password: hashedPassword,
      role: finalRole,
      profilePhoto
    });

    await user.save();

    res.json({ message: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        location: user.location,
        profilePhoto: user.profilePhoto
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/get-user/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.json(user);
});

router.put("/update-user/:id", async (req, res) => {
  try {
    const { fullName, phoneNumber, location, profilePhoto } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { fullName, phoneNumber, location, profilePhoto },
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
