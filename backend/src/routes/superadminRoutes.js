const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ExamConfig = require('../models/ExamConfig');
const Banner = require('../models/Banner');
const Enquiry = require('../models/Enquiry');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verifySuperAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized token missing.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'topiq_secret_key_2026');
    if (decoded.role !== 'super_admin' && decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Super Admin privileges required.' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

// 1. DREAM 11 STYLE DETAILED METRICS & REVENUE SPLITS BREAKDOWN
router.get('/metrics', verifySuperAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).populate('referredBy');
    const partners = await User.find({ role: { $in: ['asm', 'franchise', 'agent'] } });
    const pendingEnquiriesCount = await Enquiry.countDocuments({ status: { $in: ['Pending', 'Follow-up Required'] } });

    // Revenue calculations
    let totalRevenue = 0;
    const revenueByFranchise = {};
    const revenueByASM = {};
    const revenueByAgent = {};

    students.forEach(student => {
      const fee = student.registrationFee || 1100;
      totalRevenue += fee;

      if (student.franchiseId) {
        revenueByFranchise[student.franchiseId] = (revenueByFranchise[student.franchiseId] || 0) + fee;
      }
      if (student.asmId) {
        revenueByASM[student.asmId] = (revenueByASM[student.asmId] || 0) + fee;
      }
      if (student.agentId) {
        revenueByAgent[student.agentId] = (revenueByAgent[student.agentId] || 0) + fee;
      }
    });

    return res.status(200).json({
      success: true,
      metrics: {
        totalRevenue,
        totalAdmissions: students.length,
        activePartnersCount: partners.length,
        pendingEnquiriesCount,
        breakdown: {
          revenueByFranchise,
          revenueByASM,
          revenueByAgent
        }
      }
    });
  } catch (err) {
    console.error('Metrics fetch error:', err);
    return res.status(500).json({ success: false, message: 'Failed to compute Dream11 style dashboard metrics.' });
  }
});

// 2. EXAM TEST FEES MANAGEMENT (Get & Update per Class)
router.get('/fees', async (req, res) => {
  try {
    const fees = await ExamConfig.find({});
    return res.status(200).json({ success: true, fees });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching exam fee configurations.' });
  }
});

router.post('/fees', verifySuperAdmin, async (req, res) => {
  try {
    const { className, testFee, passingMarks, totalMarks } = req.body;
    if (!className || testFee === undefined) {
      return res.status(400).json({ success: false, message: 'Class name and test fee are required.' });
    }
    const updatedFee = await ExamConfig.findOneAndUpdate(
      { className },
      { testFee, passingMarks: passingMarks || 40, totalMarks: totalMarks || 100, isActive: true },
      { upsert: true, new: true, returnDocument: 'after' }
    );
    return res.status(200).json({ success: true, message: `Test fee for ${className} updated successfully!`, updatedFee });
  } catch (err) {
    console.error('Error updating fee:', err);
    return res.status(500).json({ success: false, message: 'Error updating test fee.' });
  }
});

// 3. BANNERS & FESTIVE OFFERS MANAGEMENT
router.get('/banners', async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, banners });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching banners.' });
  }
});

router.post('/banners', verifySuperAdmin, async (req, res) => {
  try {
    const { title, imageUrl, targetLink, position, startDate, endDate } = req.body;
    const newBanner = new Banner({ title, imageUrl, targetLink, position, startDate, endDate });
    await newBanner.save();
    return res.status(201).json({ success: true, message: 'Promotional banner added successfully!', newBanner });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error saving banner.' });
  }
});

router.delete('/banners/:id', verifySuperAdmin, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Banner removed successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting banner.' });
  }
});

// 4. HIERARCHY & USERS MANAGEMENT (View, Edit, Deactivate by Role)
router.get('/users-directory', verifySuperAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching users directory.' });
  }
});

router.put('/users/:id', verifySuperAdmin, async (req, res) => {
  try {
    const { name, email, status, role, gstNumber } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, status, role, gstNumber },
      { new: true }
    ).select('-password');
    return res.status(200).json({ success: true, message: 'User updated successfully!', updatedUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating user profile.' });
  }
});

// 5. WEBSITE LEADS & ENQUIRIES (Live sync, Accept/Deny, Edit, Create Account)
router.get('/enquiries', verifySuperAdmin, async (req, res) => {
  try {
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, enquiries });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching enquiries.' });
  }
});

router.put('/enquiries/:id', verifySuperAdmin, async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const updated = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { status, adminRemarks },
      { new: true }
    );
    return res.status(200).json({ success: true, message: 'Enquiry status updated successfully.', updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating enquiry.' });
  }
});

// 6. PROVISION HIERARCHICAL ACCOUNT (With Optional GST Number)
router.post('/provision', verifySuperAdmin, async (req, res) => {
  try {
    const { name, email, password, targetRole, gstNumber } = req.body;
    if (!name || !email || !password || !targetRole) {
      return res.status(400).json({ success: false, message: 'Required fields missing for provisioning.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: targetRole, // 'asm', 'franchise', 'agent', 'admin'
      gstNumber: gstNumber || '',
      status: 'active',
      walletBalance: 0
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: `Successfully provisioned ${targetRole} account for ${name}!` });
  } catch (err) {
    console.error('Provision error:', err);
    return res.status(500).json({ success: false, message: 'Server error during account provisioning.' });
  }
});

module.exports = router;