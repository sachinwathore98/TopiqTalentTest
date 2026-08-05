const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Route Handlers
const studentRoutes = require('./routes/studentRoutes');
const franchiseRoutes = require('./routes/franchiseRoutes');
const userRoutes = require('./routes/userRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const examRoutes = require('./routes/examRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://topiqtalent.com',
    'https://www.topiqtalent.com',
    'https://topiq-talent-test.vercel.app',
    'https://topiq-talent-test.onrender.com' // Added your exact Render backend domain
  ],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/student', studentRoutes);
app.use('/api/franchise', franchiseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health Check Root Route
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'TOPIQ Talent Test (TTT) API Server is live and running (2026)',
    activeEnvironment: 'Production / Brevo REST API Enabled'
  });
});

// MongoDB Database Connection & Server Initialization
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas successfully!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });