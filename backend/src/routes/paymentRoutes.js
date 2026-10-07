const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admission = require('../models/Admission');
const { processAutomaticCommissions } = require('../controllers/commissionEngine');

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

// 2. Verify Payment, Register Student & Sync with Super Admin Admission Management
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

    // Check if user already exists
    let existingUser = await User.findOne({ email: userData.email.toLowerCase().trim() });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password || 'Topiq@123', 10);
      existingUser = new User({
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
      await existingUser.save();
    }

    // Check if Admission record already exists for this payment
    let existingAdmission = await Admission.findOne({ paymentId: razorpay_payment_id });
    if (!existingAdmission) {
      const count = await Admission.countDocuments();
      const admissionId = `TOPIQ-ADM-${String(count + 1).padStart(6, '0')}`;
      const feeAmount = userData.registrationFee ? parseFloat(userData.registrationFee) : 1999;

      existingAdmission = new Admission({
        admissionId,
        studentName: userData.name,
        mobile: userData.phone,
        email: userData.email.toLowerCase().trim(),
        studentClass: userData.studentClass || 'Class 5',
        school: userData.school || '',
        parentDetails: userData.parentDetails || '',
        address: userData.address || '',
        examName: 'TOPIQ Talent Test',
        franchiseId: userData.assignedFranchise || null,
        asmId: userData.assignedASM || null,
        coordinatorId: null, // Direct public website admission
        admissionAmount: feeAmount,
        paymentStatus: 'Paid',
        paymentId: razorpay_payment_id,
        paymentDate: new Date(),
        admissionStatus: 'Confirmed',
        settlementStatus: 'Pending'
      });

      await existingAdmission.save();

      // Trigger automatic commission engine splits
      try {
        await processAutomaticCommissions(existingAdmission._id);
      } catch (commErr) {
        console.error('Commission engine sync note:', commErr);
      }
    }

    const tokenPayload = {
      id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role
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
      role: existingUser.role,
      admission: existingAdmission
    });

  } catch (error) {
    console.error('Payment Verification & Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error during verification and registration.' });
  }
});

module.exports = router;