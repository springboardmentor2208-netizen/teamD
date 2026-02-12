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

        // Convert profilePicture object to URL if data exists
        const userObj = user.toObject();
        if (userObj.profilePicture && userObj.profilePicture.data) {
            userObj.profilePicture = `http://localhost:5000/api/auth/user-photo/${user._id}`;
        } else {
            userObj.profilePicture = '';
        }

        res.json(userObj);
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

const multer = require("multer");
const path = require("path");

// Set up storage engine (Memory Storage for DB)
const storage = multer.memoryStorage();

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('profileImage');

// Check file type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

router.post("/upload-profile-pic/:id", (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ msg: err });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ msg: 'No file selected!' });
            } else {
                try {
                    const user = await User.findById(req.params.id);
                    if (!user) {
                        return res.status(404).json({ msg: "User not found" });
                    }

                    // Log file info for debugging
                    console.log("File received:", req.file);

                    // Ensure profilePicture is an object (migration from string)
                    if (!user.profilePicture || typeof user.profilePicture !== 'object') {
                        user.profilePicture = {};
                    }

                    user.profilePicture.data = req.file.buffer;
                    user.profilePicture.contentType = req.file.mimetype;

                    await user.save();

                    res.json({
                        msg: 'File Uploaded!',
                        file: `http://localhost:5000/api/auth/user-photo/${user._id}?t=${Date.now()}` // Return URL with timestamp
                    });
                } catch (error) {
                    console.error("Upload Error:", error);
                    res.status(500).json({ error: error.message });
                }
            }
        }
    });
});

router.get("/user-photo/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.profilePicture || !user.profilePicture.data) {
            return res.status(404).send('No image found');
        }
        res.set('Content-Type', user.profilePicture.contentType);
        res.send(user.profilePicture.data);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
