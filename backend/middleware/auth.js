const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check for Header and Bearer prefix
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // 2. Verify Token
    // Wrapping in a nested try/catch helps identify specific JWT errors
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find User and Attach to Request
    // We only need the ID and Role for most checks, so .select("-password") is perfect
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User session no longer exists." });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    
    // Distinguish between expired and invalid tokens for better Frontend UX
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
    
    res.status(401).json({ message: "Not authorized, token failed." });
  }
};

exports.adminOnly = (req, res, next) => {
  // Added a check to ensure req.user exists (protect must be called first)
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access Denied: Admin privileges required." });
  }
};

// HELPER: Volunteer or Admin check (useful for assignment routes)
exports.staffOnly = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "volunteer")) {
    next();
  } else {
    return res.status(403).json({ message: "Restricted to Admin or Volunteers." });
  }
};