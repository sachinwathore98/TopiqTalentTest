const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Route Handlers from src/routes
const authRoutes = require('./src/routes/authRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const franchiseRoutes = require('./src/routes/franchiseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://topiqtalenttest.com'],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/franchise', franchiseRoutes);

// Health Check Root Route
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'TOPIQ Talent Test (TTT) API Server is live and running (2026)',
    activeEnvironment: 'Production / Development'
  });
});

// MongoDB Database Connection & Server Initialization
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://admin_user:Topiq%40123@cluster0.xxxxx.mongodb.net/topiq_ttt?retryWrites=true&w=majority';

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