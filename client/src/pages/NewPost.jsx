import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NewPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include', // 🔒 Session cookie for auth
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create post');
      }

      setSuccess('Post created!');
      setFormData({ title: '', imageUrl: '', description: '' });

      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition"
          >
            Post
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-4 text-center">{success}</p>}
      </div>
    </div>
  );
};

export default NewPost;
