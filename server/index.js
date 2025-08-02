// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const path = require('path');

// const app = express();

// // ✅ Console log to confirm server starts
// console.log('✅ index.js is running');

// // ✅ Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('✅ MongoDB connected');
//     app.listen(process.env.PORT || 5000, () => {
//       console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
//     });
//   })
//   .catch(err => {
//     console.error('❌ MongoDB connection error:', err.message);
//   });

// // ✅ Middleware - JSON & static files
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // ✅ CORS - allow frontend to use credentials
// app.use(cors({
//   origin: ['https://instapicme.netlify.app', 'http://localhost:3000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// app.set('trust proxy', 1);


// // ✅ Session (cookie) configuration
// app.use(session({
//   name: 'sid',
//   secret: process.env.SESSION_SECRET || 'keyboardcat',
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGO_URI,
//     ttl: 60 * 60 * 24, // 1 day
//   }),
//   cookie: {
//     httpOnly: true,
//     secure: true,           // ✅ Required for Render HTTPS
//     sameSite: 'none',       // ✅ Required for cross-origin cookies
//     maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
//   }
// }));

// // ✅ Routes
// const authRoutes = require('./routes/auth');
// const postRoutes = require('./routes/posts');
// const userRoutes = require('./routes/users');

// app.use('/api/auth', authRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/users', userRoutes);




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

// ✅ CORS for local dev
app.use(cors({
 origin: [
  'https://instapicme.netlify.app',
  'https://instapichere.netlify.app',  // ✅ <-- NEW one!
  'http://localhost:3000'
],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ✅ Session config for localhost (no HTTPS)
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'keyboardcat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 60 * 60 * 24,
  }),
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}));

// ✅ Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
