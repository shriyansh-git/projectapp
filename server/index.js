require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

// ✅ Environment
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ✅ Middleware
app.use(express.json());

// ✅ CORS - Allow frontend to send credentials
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

// ✅ Session Config
app.set('trust proxy', 1); // Important for Render HTTPS cookies

app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
  }),
  cookie: {
    httpOnly: true,
    secure: true, // must be true on Render (HTTPS)
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
