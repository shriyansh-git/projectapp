import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Post({ post, toggleLike, handleCommentSubmit }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === '') return;
    handleCommentSubmit(e, post._id, commentText);
    setCommentText('');
  };

  return (
    <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden shadow-md">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-1 text-white">{post.title}</h2>
        <p className="text-gray-400 text-sm mb-2">{post.description}</p>

        {/* ✅ Username Link */}
        <p className="text-indigo-400 text-xs mb-3">
          Posted by{' '}
          <Link to={`/profile/${post.user?._id}`} className="underline hover:text-indigo-300">
            {post.user?.username}
          </Link>
        </p>

        {/* Like Button */}
        <button
          onClick={() => toggleLike(post._id)}
          className={`text-sm font-medium px-3 py-1 rounded-full border ${
            post.liked
              ? 'bg-pink-600 border-pink-600'
              : 'bg-gray-800 border-gray-600'
          } text-white`}
        >
          {post.liked ? '♥ Liked' : '♡ Like'}
        </button>

        {/* Toggle Comments */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="ml-4 text-sm text-indigo-400 underline"
        >
          {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-3">
            {post.comments?.length > 0 ? (
              post.comments.map((comment, i) => (
                <div key={i} className="text-sm text-gray-300 border-t border-gray-700 pt-2">
                  <p className="text-white">{comment.text}</p>
                  {comment.user?.username && (
                    <p className="text-xs text-gray-500 mt-1">— {comment.user.username}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}

            {/* Add Comment */}
            <form onSubmit={handleSubmit} className="mt-2">
              <input
                type="text"
                name="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-2 bg-gray-800 border border-gray-700 text-sm rounded-lg text-white placeholder-gray-400 focus:outline-none"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
