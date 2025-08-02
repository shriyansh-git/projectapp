import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur-md text-gray-200 px-4 py-3 border-b border-gray-800 shadow">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold text-white">
          Instapic
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/profile" className="hover:text-white transition">
                Profile
              </Link>
              <Link to="/create" className="hover:text-white transition">
                Post
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-white transition">
                Login
              </Link>
              <Link to="/register" className="hover:text-white transition">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={toggleMenu} className="md:hidden text-gray-300 hover:text-white transition">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 px-4 space-y-3 pb-4">
          {user ? (
            <>
              <Link to="/profile" className="block hover:text-white transition" onClick={toggleMenu}>
                Profile
              </Link>
              <Link to="/create" className="block hover:text-white transition" onClick={toggleMenu}>
                Post
              </Link>
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="block w-full text-left bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block hover:text-white transition" onClick={toggleMenu}>
                Login
              </Link>
              <Link to="/register" className="block hover:text-white transition" onClick={toggleMenu}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
