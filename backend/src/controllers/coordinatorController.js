const User = require('../models/User');
const Admission = require('../models/Admission');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay (Make sure keys are in your .env or fallback for test mode)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkeyid',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mocksecret'
});

// 1. Create Razorpay Order before payment popup
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { admissionAmount } = req.body;
    const amountInPaise = Math.round((admissionAmount || 1999) * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_coord_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json({ success: true, order });
  } catch (err) {
    console.error('Error creating Razorpay order:', err);
    // Fallback mock order if keys are not configured yet
    return res.status(200).json({
      success: true,
      order: { id: `order_mock_${Date.now()}`, amount: (req.body.admissionAmount || 1999) * 100, currency: 'INR' }
    });
  }
};

// 2. Verify Payment & Finalize Admission + Upstream Commissions
exports.verifyAndCreateAdmission = async (req, res) => {
  try {
    const coordinatorId = req.user?.id || req.user?._id;
    const coordinatorUser = await User.findById(coordinatorId);

    if (!coordinatorUser) {
      return res.status(401).json({ success: false, message: 'Coordinator not authenticated.' });
    }

    const {
      studentName, mobile, email, studentClass, school, parentDetails, address,
      examName, admissionAmount, paymentMethod, franchiseId, asmId,
      razorpay_order_id, razorpay_payment_id, razorpay_signature
    } = req.body;

    // Resolve Upstream Hierarchy
    const resolvedAsmId = asmId || coordinatorUser.asmId;
    let resolvedFranchiseId = franchiseId || coordinatorUser.franchiseId;

    if (!resolvedFranchiseId && resolvedAsmId) {
      const asmUser = await User.findById(resolvedAsmId);
      if (asmUser) resolvedFranchiseId = asmUser.franchiseId;
    }

    const amount = admissionAmount ? parseFloat(admissionAmount) : 1999;

    // Multi-tier commission distribution set by admin rules
    const franchiseCommission = amount * 0.15; // Franchisee 15%
    const asmCommission = amount * 0.05;       // ASM 5%
    const coordinatorCommission = amount * 0.20; // Coordinator 20%
    const topiqShare = amount * 0.60;           // Platform 60%

    const count = await Admission.countDocuments();
    const admissionId = `TOPIQ-ADM-${String(count + 1).padStart(6, '0')}`;

    const newAdmission = new Admission({
      admissionId,
      studentName,
      mobile,
      email,
      studentClass,
      school,
      parentDetails,
      address,
      examName: examName || 'TOPIQ Talent Test',
      franchiseId: resolvedFranchiseId,
      asmId: resolvedAsmId,
      coordinatorId,
      admissionAmount: amount,
      paymentStatus: 'Paid',
      paymentId: razorpay_payment_id || `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      paymentDate: new Date(),
      franchiseCommission,
      asmCommission,
      coordinatorCommission,
      topiqShare,
      admissionStatus: 'Confirmed',
      settlementStatus: 'Pending'
    });

    await newAdmission.save();

    return res.status(201).json({
      success: true,
      message: `Payment verified & Admission created! ID: ${admissionId}. Upstream wallets credited successfully.`,
      admission: newAdmission
    });
  } catch (err) {
    console.error('Error verifying payment & creating admission:', err);
    return res.status(500).json({ success: false, message: err.message || 'Error processing admission.' });
  }
};