const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require('../models/Post');
const { isAuthenticated } = require('../middleware/auth');

// GET public user profile and their posts
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username followers following')
      .populate('followers', 'username')
      .populate('following', 'username');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const posts = await Post.find({ user: user._id })
      .select('title description imageUrl') // ✅ corrected field
      .sort({ createdAt: -1 });

    res.json({
      user,
      posts,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Follow a user
router.post('/:id/follow', isAuthenticated, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || userToFollow._id.equals(currentUser._id)) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    if (!userToFollow.followers.includes(currentUser._id)) {
      userToFollow.followers.push(currentUser._id);
      currentUser.following.push(userToFollow._id);
      await userToFollow.save();
      await currentUser.save();
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// Unfollow a user
router.post('/:id/unfollow', isAuthenticated, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow || userToUnfollow._id.equals(currentUser._id)) {
      return res.status(400).json({ error: 'Invalid user' });
    }

    userToUnfollow.followers = userToUnfollow.followers.filter(
      uid => !uid.equals(currentUser._id)
    );
    currentUser.following = currentUser.following.filter(
      uid => !uid.equals(userToUnfollow._id)
    );

    await userToUnfollow.save();
    await currentUser.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

module.exports = router;
