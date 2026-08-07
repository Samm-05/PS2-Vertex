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
const notificationRoutes = require('./routes/notifications');
const experimentRoutes = require('./routes/experiments');
const reportRoutes = require('./routes/reports');

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for shared frontend origins across devices
const allowedOrigins = new Set(
  [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3015',
    'http://localhost:3016',
    'http://localhost:3017',
    'http://localhost:3018',
    'http://localhost:3019',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URLS || '').split(',').map((origin) => origin.trim()),
  ].filter(Boolean)
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Serve uploaded assets (avatars, attachments)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Route Prefix Definitions
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/experiments', experimentRoutes);
app.use('/api/reports', reportRoutes);

// Base Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'ML Visual Lab Shared Backend API is running',
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mlsim';

if (!process.env.MONGODB_URI) {
  console.warn('⚠️ WARNING: process.env.MONGODB_URI is not defined! Using fallback:', MONGO_URI);
}

// Connect to Shared MongoDB Database
mongoose
  .connect(MONGO_URI)
  .then(() => {
    const host = mongoose.connection.host;
    const dbName = mongoose.connection.name;
    console.log(`✅ [DATABASE CONNECTED] Successfully connected to MongoDB cluster: ${host} (Database: ${dbName})`);

    app.listen(PORT, () => console.log(`🚀 [SERVER RUNNING] ML Visual Lab API listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ [DATABASE ERROR] Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });