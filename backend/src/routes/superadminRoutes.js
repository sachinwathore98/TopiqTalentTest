const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ExamConfig = require('../models/ExamConfig');
const Banner = require('../models/Banner');
const Enquiry = require('../models/Enquiry');
const ScholarshipConfig = require('../models/ScholarshipConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 11 Consolidated Class Groups aligned with TOPIQ Talent Test specifications
const classesList = [
  'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 
  'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 
  '12th & Above & Competitive Exams'
];

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

// 1. METRICS & REVENUE SPLITS
router.get('/metrics', verifySuperAdmin, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).populate('referredBy');
    const partners = await User.find({ role: { $in: ['asm', 'franchise', 'agent'] } });
    const pendingEnquiriesCount = await Enquiry.countDocuments({ status: { $in: ['Pending', 'Follow-up Required'] } });

    let totalRevenue = 0;
    const revenueByFranchise = {};
    const revenueByASM = {};
    const revenueByAgent = {};

    students.forEach(student => {
      const fee = student.registrationFee || 1100;
      totalRevenue += fee;
      if (student.franchiseId) revenueByFranchise[student.franchiseId] = (revenueByFranchise[student.franchiseId] || 0) + fee;
      if (student.asmId) revenueByASM[student.asmId] = (revenueByASM[student.asmId] || 0) + fee;
      if (student.agentId) revenueByAgent[student.agentId] = (revenueByAgent[student.agentId] || 0) + fee;
    });

    return res.status(200).json({
      success: true,
      metrics: {
        totalRevenue,
        totalAdmissions: students.length,
        activePartnersCount: partners.length,
        pendingEnquiriesCount,
        breakdown: { revenueByFranchise, revenueByASM, revenueByAgent }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to compute metrics.' });
  }
});

// 2. EXAM FEES
router.get('/fees', async (req, res) => {
  try {
    const existingFees = await ExamConfig.find({});
    const feeMap = {};
    
    existingFees.forEach(f => {
      feeMap[f.className] = f;
    });

    const completeFeesList = classesList.map(className => {
      if (feeMap[className]) {
        return feeMap[className];
      } else {
        return {
          className,
          testFee: 1999,
          originalFee: 2399,
          passingMarks: 40,
          totalMarks: 100,
          isActive: true
        };
      }
    });

    return res.status(200).json({ success: true, fees: completeFeesList });
  } catch (err) {
    console.error('Error fetching fees:', err);
    return res.status(500).json({ success: false, message: 'Error fetching fees.' });
  }
});

router.post('/fees', verifySuperAdmin, async (req, res) => {
  try {
    const { className, testFee, originalFee, passingMarks, totalMarks } = req.body;
    
    const updatedFee = await ExamConfig.findOneAndUpdate(
      { className },
      { 
        testFee: Number(testFee), 
        originalFee: originalFee ? Number(originalFee) : Number(testFee), 
        passingMarks: passingMarks || 40, 
        totalMarks: totalMarks || 100, 
        isActive: true 
      },
      { upsert: true, new: true, returnDocument: 'after' }
    );

    return res.status(200).json({ 
      success: true, 
      message: `Dual pricing updated successfully for ${className}!`, 
      updatedFee 
    });
  } catch (err) {
    console.error('Error updating test fee:', err);
    return res.status(500).json({ success: false, message: 'Error updating test fee.' });
  }
});

// 3. SCHOLARSHIP & CASH PRIZES CONTROL
router.get('/scholarships', async (req, res) => {
  try {
    let prizes = await ScholarshipConfig.find({});
    if (prizes.length === 0) {
      const defaults = [
        { rankTier: 'Rank 1–10', cashAmount: 11111, label: 'Gold Tier Winner' },
        { rankTier: 'Rank 11–25', cashAmount: 9999, label: 'Silver Tier Winner' },
        { rankTier: 'Rank 26–60', cashAmount: 7777, label: 'Bronze Tier Winner' },
        { rankTier: 'Rank 61–100', cashAmount: 5555, label: 'Merit Tier Winner' }
      ];
      prizes = await ScholarshipConfig.insertMany(defaults);
    }
    return res.status(200).json({ success: true, prizes });
  } catch (err) {
    console.error('Error fetching scholarship prizes:', err);
    return res.status(500).json({ success: false, message: 'Error fetching scholarship prizes.' });
  }
});

router.post('/scholarships', verifySuperAdmin, async (req, res) => {
  try {
    const { rankTier, cashAmount } = req.body;
    const updated = await ScholarshipConfig.findOneAndUpdate(
      { rankTier },
      { cashAmount: Number(cashAmount) },
      { upsert: true, new: true, returnDocument: 'after' }
    );
    return res.status(200).json({ success: true, message: `Updated cash prize for ${rankTier}!`, updated });
  } catch (err) {
    console.error('Error updating scholarship prize:', err);
    return res.status(500).json({ success: false, message: 'Error updating scholarship prizes.' });
  }
});

// 4. BANNERS & ADVERTISEMENTS MANAGEMENT
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
    const newBanner = new Banner({ 
      title, 
      imageUrl, 
      targetLink: targetLink || '#', 
      position: position || 'hero', 
      startDate: startDate || Date.now(), 
      endDate: endDate || new Date(Date.now() + 90*24*60*60*1000) 
    });
    await newBanner.save();
    return res.status(201).json({ success: true, message: 'Advertisement / Banner published successfully!', newBanner });
  } catch (err) {
    console.error('Error saving banner:', err);
    return res.status(500).json({ success: false, message: 'Error saving banner.' });
  }
});

router.put('/banners/:id', verifySuperAdmin, async (req, res) => {
  try {
    const { title, imageUrl, targetLink, position } = req.body;
    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { title, imageUrl, targetLink: targetLink || '#', position: position || 'hero' },
      { new: true }
    );
    return res.status(200).json({ success: true, message: 'Advertisement updated successfully!', updatedBanner });
  } catch (err) {
    console.error('Error updating banner:', err);
    return res.status(500).json({ success: false, message: 'Error updating banner.' });
  }
});

router.delete('/banners/:id', verifySuperAdmin, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Advertisement banner deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting banner.' });
  }
});

// 5. USERS DIRECTORY
router.get('/users-directory', verifySuperAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error fetching users.' });
  }
});

router.put('/users/:id', verifySuperAdmin, async (req, res) => {
  try {
    const { name, email, status, role, gstNumber } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email, status, role, gstNumber }, { new: true }).select('-password');
    return res.status(200).json({ success: true, message: 'User updated!', updatedUser });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating user.' });
  }
});

// 6. WEBSITE LEADS & ENQUIRIES
router.get('/enquiries', verifySuperAdmin, async (req, res) => {
  try {
    const rawEnquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    
    const enquiries = rawEnquiries.map(enq => {
      const obj = enq.toObject();
      const type = (obj.enquiryType || obj.type || 'student').toLowerCase();
      
      if (type.includes('franchise')) obj.enquiryType = 'franchise';
      else if (type.includes('agent')) obj.enquiryType = 'agent';
      else obj.enquiryType = 'student';

      return obj;
    });

    return res.status(200).json({ success: true, enquiries });
  } catch (err) {
    console.error('Error fetching enquiries:', err);
    return res.status(500).json({ success: false, message: 'Error fetching enquiries.' });
  }
});

router.put('/enquiries/:id', verifySuperAdmin, async (req, res) => {
  try {
    const { status, adminRemarks } = req.body;
    const updated = await Enquiry.findByIdAndUpdate(req.params.id, { status, adminRemarks }, { new: true });
    return res.status(200).json({ success: true, message: 'Enquiry updated.', updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating enquiry.' });
  }
});

// 7. PROVISION ACCOUNT
router.post('/provision', verifySuperAdmin, async (req, res) => {
  try {
    const { name, email, password, targetRole, gstNumber } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(400).json({ success: false, message: 'Email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email: email.toLowerCase().trim(), password: hashedPassword, role: targetRole, gstNumber: gstNumber || '', status: 'active', walletBalance: 0 });
    await newUser.save();
    return res.status(201).json({ success: true, message: `Provisioned ${targetRole} for ${name}!` });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error during provisioning.' });
  }
});

module.exports = router;