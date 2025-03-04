const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

require("../config/passport"); // Load passport config

// Google OAuth Login Route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send token as HTTP cookie
    res.cookie("token", token, { httpOnly: true, secure: false });
    res.redirect("http://localhost:5173/dashboard");
  }
);

// Logout Route
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("http://localhost:5173");
});

module.exports = router;
