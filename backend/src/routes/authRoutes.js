const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Student = require('../models/StudentModel');

// Student & User Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    // Find student in MongoDB Atlas
    const student = await Student.findOne({ email: email.toLowerCase().trim() });
    if (!student) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Direct password comparison (or use bcrypt if hashing is implemented)
    if (student.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT Token
    const tokenPayload = {
      id: student._id,
      email: student.email,
      role: student.role || 'student',
      branchCode: student.branchCode || 'ONLINE-01'
    };

    const token = jwt.sign(
      tokenPayload, 
      process.env.JWT_SECRET || 'topiq_secret_key_2026', 
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        name: student.name,
        email: student.email,
        studentClass: student.studentClass,
        role: student.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

module.exports = router;