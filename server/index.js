require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

const isProduction = process.env.NODE_ENV === 'production';
const CLIENT_URL = isProduction
  ? 'https://instapicme.netlify.app'
  : 'http://localhost:3000';

console.log(`✅ Server starting in ${isProduction ? 'PRODUCTION' : 'LOCAL'} mode`);
console.log(`✅ Allowed origin: ${CLIENT_URL}`);

// ✅ Middleware: CORS
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// ✅ Middleware: JSON parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session configuration
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 7 * 24 * 60 * 60, // 7 days
  }),
  cookie: {
    httpOnly: true,
    secure: isProduction, // ✅ true in production (HTTPS), false locally
    sameSite: isProduction ? 'none' : 'lax', // ✅ 'none' for cross-origin, 'lax' for local
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));

// ✅ MongoDB + Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on ${isProduction ? `PORT ${PORT}` : `http://localhost:${PORT}`}`)
    );
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
