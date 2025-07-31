const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 📨 Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    req.session.user = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email
    };
    res.status(201).json({ user: req.session.user });
  } catch (err) {
    console.error('❌ Register error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 🔑 Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };
    res.status(200).json({ user: req.session.user });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// 👤 Me (get logged-in user)
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(200).json({ user: null });
  }
});

// 🚪 Logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out' });
  });
});
const Post = require('../models/Post'); // Make sure this is imported

// 🔹 Public user profile
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ user, posts });
  } catch (err) {
    console.error('Failed to fetch user:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


module.exports = router;
