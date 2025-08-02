const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const isAuthenticated = require('../middleware/auth'); // ✅ FIXED

// 📌 Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    console.error('Error fetching all posts:', err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// 📌 Get current user's posts (for Profile page)
router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.session.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'username')
      .populate('comments.user', 'username');

    res.json(posts);
  } catch (err) {
    console.error('Error fetching your posts:', err);
    res.status(500).json({ error: 'Failed to fetch your posts' });
  }
});

// 📌 Create post
router.post('/', isAuthenticated, async (req, res) => {
  const { title, imageUrl, description } = req.body;

  try {
    const post = new Post({
      title,
      imageUrl,
      description,
      user: req.session.user.id,
    });

    await post.save();
    const populated = await post.populate('user', 'username');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// 📌 Comment on post
router.post('/:id/comments', isAuthenticated, async (req, res) => {
  const { text } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const comment = {
      text,
      user: req.session.user.id,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();
    const populated = await Post.findById(post._id).populate('comments.user', 'username');
    res.status(201).json(populated.comments.at(-1));
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// 📌 Like/unlike post
router.post('/:id/like', isAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const userId = req.session.user.id;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    res.status(200).json({ likes: post.likes });
  } catch (err) {
    console.error('Error toggling like:', err);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

module.exports = router;
