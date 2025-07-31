const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { isAuthenticated } = require('../middleware/auth');

// 🔹 Create a new post
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, imageUrl, description } = req.body;
    const post = new Post({
      title,
      imageUrl,
      description,
      user: req.user.id // use id, not _id
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error('❌ Error creating post:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 🔹 Get all posts with populated user and comments.user
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username')           // post author username
      .populate('comments.user', 'username') // commenters username
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('❌ Error fetching posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 🔹 Get logged-in user's posts
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error('❌ Error fetching user posts:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// 🔹 Add comment to a post
router.post('/:id/comments', isAuthenticated, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    post.comments.push({ text, user: req.user.id });
    await post.save();

    res.status(200).json({ message: 'Comment added' });
  } catch (err) {
    console.error('❌ Error adding comment:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
