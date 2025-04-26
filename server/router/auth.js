// server/router/auth.js
require('dotenv').config();         // ensure env-vars are available here too
const express = require('express');
const bcrypt  = require('bcrypt');
const User    = require('../models/schema');
const router  = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 1) Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // 2) Check if user exists
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // 3) Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // 4) Generate & save token via schema method
    const token = await user.generateAuthToken();

    // 5) Set cookie for client
    res.cookie('jwtoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });

    // 6) Send minimal user info (omit password & tokens)
    res.json({
      message: 'Login successful',
      user: { email: user.email, name: user.name }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

module.exports = router;
