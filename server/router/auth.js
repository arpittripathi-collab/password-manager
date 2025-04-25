const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/schema");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // Generate token
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

    // Set token in cookie
    res.cookie('jwtoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",  // Enable only on HTTPS
      sameSite: 'None',  // Required for cross-origin requests
      maxAge: 24 * 60 * 60 * 1000  // Token valid for 1 day
    });

    // Send response
    res.json({ message: "Login successful", user: { email: user.email } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
