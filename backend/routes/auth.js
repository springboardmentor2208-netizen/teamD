const router = require("express").Router();
const User = require("../models/User");

router.post("/register", async (req, res) => {
    try {
        const { fullName, username, email, phoneNumber, password } = req.body;

        if (!fullName || !username || !email || !password) {
            return res.status(400).json({ msg: "Please enter all required fields." });
        }

        if (password.length < 6) {
            return res.status(400).json({ msg: "Password must be at least 6 characters long." });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({ msg: "User already exists." });
        }

        const newUser = new User({
            fullName,
            username,
            email,
            phoneNumber,
            password
        });

        await newUser.save();

        res.json({ msg: "User registered successfully!" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Please enter all required fields." });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: "User does not exist." });
        }

        if (password !== user.password) {
            return res.status(400).json({ msg: "Invalid credentials." });
        }

        res.json({
            msg: "Login successful!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/get-user/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/update-user/:id", async (req, res) => {
    try {
        const { fullName, phoneNumber, location, bio } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        user.fullName = fullName || user.fullName;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.location = location || user.location;
        user.bio = bio || user.bio;

        await user.save();

        res.json({ msg: "Profile updated successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
