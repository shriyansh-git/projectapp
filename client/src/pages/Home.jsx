import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../components/Post';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
          credentials: 'include',
        });

        const data = await res.json();
        console.log('Fetched posts:', data); // ✅ Add debug log

        // Check if data is an array
        if (Array.isArray(data)) {
          setPosts(data.map(post => ({ ...post, liked: false })));
        } else {
          console.warn('Unexpected posts response:', data);
        }
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleLike = postId => {
    setPosts(prev =>
      prev.map(post =>
        post._id === postId ? { ...post, liked: !post.liked } : post
      )
    );
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const text = e.target.comment.value.trim();
    if (!text) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        setPosts(prev =>
          prev.map(post =>
            post._id === postId
              ? { ...post, comments: [...(post.comments || []), { text }] }
              : post
          )
        );
        e.target.reset();
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-10">📸 Explore</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts yet.</p>
      ) : (
        <div className="flex flex-col gap-10">
          {posts.map(post => (
            <Post
              key={post._id}
              post={post}
              toggleLike={toggleLike}
              handleCommentSubmit={handleCommentSubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
