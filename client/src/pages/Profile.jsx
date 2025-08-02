import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/me`, {
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch your posts');
        const data = await res.json();
        setMyPosts(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    if (user) fetchMyPosts();
  }, [user]);

  return (
    <div className="min-h-screen px-4 py-10 bg-black text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">👤 Profile</h1>

        {user ? (
          <>
            {/* Profile Header */}
            <div className="flex items-center gap-4 bg-gray-900 p-6 rounded-xl border border-gray-800 mb-6">
              <div className="w-20 h-20 bg-gray-700 rounded-full" />
              <div>
                <p className="text-xl font-bold">@{user.username}</p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>

            <hr className="my-6 border-gray-700" />

            {/* Your Posts */}
            <h2 className="text-2xl font-semibold mb-4">Your Posts</h2>
            {error && (
              <p className="text-red-500 mb-4 text-sm">{error}</p>
            )}

            {myPosts.length === 0 ? (
              <p className="text-gray-400">You haven’t posted anything yet.</p>
            ) : (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {myPosts.map(post => (
                  <div
                    key={post._id}
                    className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                  >
                    <div className="relative group">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm px-2 text-center">
                        {post.title}
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">{post.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-400">Loading...</p>
        )}
      </div>
    </div>
  );
}
