require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();

// ✅ CORS must come BEFORE any body parsers or static files
app.use(cors({
  origin: ['https://instapicme.netlify.app'], // Frontend domain
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ JSON parser and static uploads folder
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Session config — sameSite & secure required for cross-site cookies
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboardcat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 24 * 60 * 60, // 1 day
  }),
  cookie: {
    httpOnly: true,
    secure: true,        // Render uses HTTPS
    sameSite: 'none',    // Required for Netlify <-> Render cookies
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}));

// ✅ Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// ✅ Connect to MongoDB and start server
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
