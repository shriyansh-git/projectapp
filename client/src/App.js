import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NewPost from './pages/NewPost';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { AuthProvider } from './context/AuthContext';
import UserProfile from './pages/UserProfile';
import SessionTest from './components/SessionTest';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <NewPost />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:userId" // ✅ FIXED
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />

            {/* Debug Route */}
            <Route path="/debug" element={<SessionTest />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
