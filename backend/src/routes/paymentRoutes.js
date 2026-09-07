const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Order Endpoint
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    
    if (!amount || parseInt(amount, 10) < 100) {
      return res.status(400).json({ success: false, message: 'Amount must be at least 100 paise.' });
    }

    const options = {
      amount: parseInt(amount, 10),
      currency,
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    return res.status(200).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    if (error.statusCode === 401) {
      return res.status(401).json({ success: false, message: 'Razorpay authentication failed.' });
    }
    return res.status(500).json({ success: false, message: 'Internal Server Error while creating order.' });
  }
});

// 2. Verify Payment & Register Student Endpoint
router.post('/verify-and-register', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userData } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userData) {
      return res.status(400).json({ success: false, message: 'Missing required payment verification or user parameters.' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Verification failed.' });
    }

    const existingUser = await User.findOne({ email: userData.email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(userData.password || 'Topiq@123', 10);

    const newUser = new User({
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      password: hashedPassword,
      phone: userData.phone,
      role: 'student',
      studentClass: userData.studentClass || 'Class 5',
      city: userData.city || '',
      district: userData.district || '',
      state: userData.state || 'Maharashtra',
      pincode: userData.pincode || '',
      is_paid: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });

    await newUser.save();

    // Automated Commission Splits on ₹1,100 Fee
    const feeAmount = 1100;
    if (userData.assignedAgent) {
      await User.findByIdAndUpdate(userData.assignedAgent, { $inc: { walletBalance: feeAmount * 0.20 } });
    }
    if (userData.assignedFranchise) {
      await User.findByIdAndUpdate(userData.assignedFranchise, { $inc: { walletBalance: feeAmount * 0.15 } });
    }
    if (userData.assignedASM) {
      await User.findByIdAndUpdate(userData.assignedASM, { $inc: { walletBalance: feeAmount * 0.05 } });
    }

    const tokenPayload = {
      id: newUser._id,
      email: newUser.email,
      role: newUser.role
    };

    const token = jwt.sign(
      tokenPayload, 
      process.env.JWT_SECRET || 'topiq_secret_key_2026', 
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'Payment verified and registration successful!',
      token,
      role: newUser.role
    });

  } catch (error) {
    console.error('Payment Verification & Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error during verification and registration.' });
  }
});

module.exports = router;