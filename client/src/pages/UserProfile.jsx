import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/users/${userId}`,
          { withCredentials: true }
        );

        setProfile(res.data);

        // Check if current user follows this profile
        if (
          currentUser &&
          res.data.user.followers?.some((f) => f._id === currentUser.id)
        ) {
          setIsFollowing(true);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, currentUser]);

  const handleFollowToggle = async () => {
    try {
      const action = isFollowing ? 'unfollow' : 'follow';
      await axios.post(
        `${API_BASE}/api/users/${profile.user._id}/${action}`,
        {},
        { withCredentials: true }
      );

      setIsFollowing(!isFollowing);
      setProfile((prev) => ({
        ...prev,
        followersCount: isFollowing
          ? prev.followersCount - 1
          : prev.followersCount + 1,
      }));
    } catch (err) {
      console.error('Follow/Unfollow error:', err);
    }
  };

  if (loading)
    return <p className="text-gray-400 text-center mt-10">Loading profile...</p>;
  if (!profile)
    return <p className="text-red-400 text-center mt-10">User not found.</p>;

  const { user, posts = [], followersCount, followingCount } = profile;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-5 mb-8">
          <div>
            <h2 className="text-2xl font-bold">@{user.username}</h2>
            <div className="text-sm text-gray-400 mt-1">
              <span className="mr-4">Followers: {followersCount}</span>
              <span>Following: {followingCount}</span>
            </div>
          </div>

          {currentUser?.id !== user._id && (
            <button
              onClick={handleFollowToggle}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                isFollowing
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>

        {/* Posts Section */}
        <h3 className="text-xl font-semibold mb-4">Posts</h3>

        {posts.length === 0 ? (
          <p className="text-gray-500">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                {post.imageUrl && (
                  <div className="relative group">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm text-white px-2 text-center">
                      {post.title}
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <h4 className="text-md font-medium">{post.title}</h4>
                  <p className="text-sm text-gray-400">{post.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
