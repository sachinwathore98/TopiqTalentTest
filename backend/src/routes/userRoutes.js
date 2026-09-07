const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Middleware to verify token and admin role
const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'topiq_secret_key_2026');
    if (decoded.role !== 'super_admin' && decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// 1. Unified Login Route (POST /api/users/login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status === 'deactivated') {
      return res.status(403).json({ success: false, message: 'This account has been deactivated by the administrator.' });
    }

    const isMatch = await bcrypt.compare(password, user.password).catch(() => false);
    if (!isMatch && user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const tokenPayload = {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'topiq_secret_key_2026',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      role: user.role,
      name: user.name,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletBalance: user.walletBalance || 0
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login authentication.' });
  }
});

// 2. Get All Users & Enquiries (GET /api/users/all)
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    // Aggregate mock or real website enquiries if stored in database
    const enquiries = [
      { name: 'Rahul Patil', phone: '9855443322', type: 'Franchise Partner', city: 'Pune', createdAt: new Date() },
      { name: 'Sneha Kulkarni', phone: '9766554433', type: 'Agent Enquiry', city: 'Nashik', createdAt: new Date() }
    ];

    return res.status(200).json({
      success: true,
      users,
      enquiries
    });
  } catch (err) {
    console.error('Fetch users error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve users directory.' });
  }
});

// 3. Create Hierarchical User Account (POST /api/users/create)
router.post('/create', verifyAdmin, async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;

    if (!name || !email || !password || !targetRole) {
      return res.status(400).json({ success: false, message: 'All user creation fields are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'User account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: targetRole, // 'admin', 'asm', 'franchise', 'agent', 'student'
      status: 'active',
      walletBalance: 0
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: `Successfully provisioned ${targetRole} account for ${name}!`
    });
  } catch (err) {
    console.error('User creation error:', err);
    return res.status(500).json({ success: false, message: 'Server error while creating account.' });
  }
});

// 4. Toggle User Status Active/Deactivated (PUT /api/users/:id/status)
router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ success: false, message: 'Target user not found.' });

    targetUser.status = status;
    await targetUser.save();

    return res.status(200).json({ success: true, message: `User status updated to ${status}.` });
  } catch (err) {
    console.error('Status update error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
});

module.exports = router;