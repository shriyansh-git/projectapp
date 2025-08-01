require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();

// ✅ CORS - needs to go early
app.use(cors({
  origin: 'https://instapicme.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Pre-flight OPTIONS support
app.options('*', cors({
  origin: 'https://instapicme.netlify.app',
  credentials: true,
}));

// ✅ JSON parser
app.use(express.json());

// ✅ Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Session (must come BEFORE routes)
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
    secure: true,       // must be true on Render
    sameSite: 'none',   // for cross-origin cookie
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  }
}));

// ✅ Routes (must come after session)
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

// ✅ Start server AFTER DB connects
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
