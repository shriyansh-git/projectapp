require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();

// ✅ Log startup
console.log('✅ index.js is running');

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// ✅ Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ CORS setup
app.use(cors({
  origin: [
    'https://instapicme.netlify.app',
    'https://instapichere.netlify.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Session setup (FIXED: secure + sameSite)
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'keyboardcat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 60 * 60 * 24, // 1 day
  }),
  cookie: {
    httpOnly: true,
    secure: true,         // ✅ Required for HTTPS
    sameSite: 'none',     // ✅ Allows cross-origin
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  }
}));

// ✅ Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
