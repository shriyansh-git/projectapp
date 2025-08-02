require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

// ✅ Frontend Netlify URL
const CLIENT_URL = 'https://instapicme.netlify.app';

// ✅ Log to confirm server starts
console.log('✅ index.js is running');

// ✅ Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session config
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
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// ❌ REMOVE frontend serving – not needed for backend-only Render deployment
// app.use(express.static(path.join(__dirname, '../client/build')));
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '../client/build/index.html'))
// );

// ✅ Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
