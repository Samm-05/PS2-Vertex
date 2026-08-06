const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const dashboardRoutes = require('./routes/dashboard');
const leaderboardRoutes = require('./routes/leaderboard');
const simulationRoutes = require('./routes/simulations');
const practiceRoutes = require('./routes/practice');

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable CORS for frontend
const allowedOrigins = new Set(
  [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URLS || '').split(',').map((origin) => origin.trim()),
  ].filter(Boolean)
);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser clients (no origin header) and configured browser origins
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// serve uploaded files (avatars etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// api prefix
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/practice', practiceRoutes);

// fallback
app.get('/', (req, res) => {
  res.send('ML Simulator Backend is running');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mlsim';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
