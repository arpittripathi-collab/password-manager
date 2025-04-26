// server/router/routing.js
require('dotenv').config();
const express      = require('express');
const router       = express.Router();
const User         = require('../models/schema');
const authenticate = require('../middlewares/authenticate');

// — REGISTER —  
router.post('/register', async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  if (!name || !email || !password || !cpassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (password !== cpassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    // normalize email
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // schema pre-save will hash for us
    const newUser = new User({ name: name.trim(), email: normalizedEmail, password });
    await newUser.save();
    return res.status(201).json({ message: 'User created successfully.' });

  } catch (err) {
    console.error('Registration Error:', err);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
});

// — LOGIN —  
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // generateAuthToken saves to user.tokens
    const token = await user.generateAuthToken();
    res.cookie('jwtoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.json({ message: 'Login successful.' });

  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

// — GET CURRENT USER —  
router.get('/authenticate', authenticate, (req, res) => {
  const { _id, name, email, vault } = req.rootUser;
  res.json({ id: _id, name, email, vault: req.rootUser.getVault() });
});

// — ADD A NEW CREDENTIAL —  
router.post('/vault', authenticate, async (req, res) => {
  const { platform, platEmail, password } = req.body;
  if (!platform || !platEmail || !password) {
    return res.status(400).json({ error: 'platform, platEmail & password are required.' });
  }
  try {
    await req.rootUser.addNewPassword(password, platform, platEmail);
    return res.status(201).json({ message: 'Credential added.' });
  } catch (err) {
    console.error('Add Credential Error:', err);
    return res.status(500).json({ error: 'Server error adding credential.' });
  }
});

// — DELETE A CREDENTIAL —  
router.delete('/vault/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await User.updateOne(
      { _id: req.userId },
      { $pull: { vault: { _id: id } } }
    );
    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Credential not found.' });
    }
    return res.json({ message: 'Credential deleted.' });
  } catch (err) {
    console.error('Delete Credential Error:', err);
    return res.status(500).json({ error: 'Server error deleting credential.' });
  }
});

// — LOGOUT —  
router.post('/logout', authenticate, (req, res) => {
  res.clearCookie('jwtoken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None'
  });
  res.json({ message: 'Logout successful.' });
});

// — DECRYPT (protected) —  
router.post('/decrypt', authenticate, (req, res) => {
  const { iv, encryptedPassword } = req.body;
  if (!iv || !encryptedPassword) {
    return res.status(400).json({ error: 'iv & encryptedPassword required.' });
  }
  try {
    const plain = decrypt(encryptedPassword, iv);
    return res.json({ password: plain });
  } catch (err) {
    console.error('Decrypt Error:', err);
    return res.status(500).json({ error: 'Server error during decryption.' });
  }
});

module.exports = router;
