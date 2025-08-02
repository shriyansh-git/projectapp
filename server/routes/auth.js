const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// 🟢 REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // ✅ Set session after registration
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    console.log('🧠 Session set after register:', req.session.user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// 🟢 LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ Set session after login
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    console.log('🧠 Session set after login:', req.session.user);
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});

// 🟢 GET CURRENT USER
router.get('/me', (req, res) => {
  console.log('🧪 /me session ID:', req.sessionID);
  console.log('🧪 /me full session:', req.session);
  console.log('🧪 /me session user:', req.session.user);

  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json(null);
  }
});

// 🟢 LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed' });

    res.clearCookie('sid', {
      path: '/',
      sameSite: 'none',
      secure: true,
    });

    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
