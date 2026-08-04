const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Route Handlers
const studentRoutes = require('./routes/studentRoutes');
const franchiseRoutes = require('./routes/franchiseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://topiqtalenttest.com', 
    'https://topiq-talent-test.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/student', studentRoutes);
app.use('/api/franchise', franchiseRoutes);

// Health Check Root Route
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'TOPIQ Talent Test (TTT) API Server is live and running (2026)',
    activeEnvironment: 'Production / Brevo SMTP Enabled'
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