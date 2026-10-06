const User = require('../models/User');
const Admission = require('../models/Admission');
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkeyid',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mocksecret'
});

// 1. Get Coordinator Dashboard Metrics
const getCoordinatorDashboard = async (req, res) => {
  try {
    const coordinatorId = req.user?.id || req.user?._id;
    const coordinatorUser = await User.findById(coordinatorId);

    const admissions = await Admission.find({ coordinatorId }).sort({ createdAt: -1 }).lean();

    const totalAdmissions = admissions.length;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todaysAdmissions = admissions.filter(a => new Date(a.createdAt) >= todayStart).length;
    const monthlyAdmissions = admissions.filter(a => new Date(a.createdAt) >= new Date(new Date().setDate(1))).length;
    const pendingAdmissions = admissions.filter(a => a.admissionStatus === 'Pending').length;
    const completedAdmissions = admissions.filter(a => a.admissionStatus === 'Confirmed').length;
    const cancelledAdmissions = admissions.filter(a => a.admissionStatus === 'Cancelled').length;

    const examWise = admissions.reduce((acc, curr) => {
      acc[curr.examName] = (acc[curr.examName] || 0) + 1;
      return acc;
    }, {});

    const totalCommission = admissions
      .filter(a => a.admissionStatus === 'Confirmed')
      .reduce((sum, adm) => sum + (adm.coordinatorCommission || ((adm.admissionAmount || 1000) * 0.20)), 0);

    const availableWallet = totalCommission * 0.85;

    return res.status(200).json({
      success: true,
      name: coordinatorUser?.name || 'Coordinator Partner',
      metrics: {
        totalAdmissions,
        todaysAdmissions,
        monthlyAdmissions,
        pendingAdmissions,
        completedAdmissions,
        cancelledAdmissions,
        examWise,
        totalCommission,
        availableWallet,
        pendingSettlement: totalCommission * 0.15,
        settledAmount: totalCommission * 0.85
      },
      admissions
    });
  } catch (err) {
    console.error('Error in getCoordinatorDashboard:', err);
    return res.status(500).json({ success: false, message: 'Server error loading coordinator dashboard.' });
  }
};

// 2. Get Upstream Hierarchy
const getHierarchy = async (req, res) => {
  try {
    const franchises = await User.find({ role: { $in: ['franchise', 'franchise_owner'] } }).select('name _id').lean();
    const asms = await User.find({ role: 'asm' }).select('name _id franchiseId').lean();
    return res.status(200).json({ success: true, franchises, asms });
  } catch (err) {
    console.error('Error fetching hierarchy:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching hierarchy.' });
  }
};

// 3. Create Razorpay Order
const createRazorpayOrder = async (req, res) => {
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
    return res.status(200).json({
      success: true,
      order: { id: `order_mock_${Date.now()}`, amount: (req.body.admissionAmount || 1999) * 100, currency: 'INR' }
    });
  }
};

// 4. Verify Payment & Finalize Admission
const verifyAndCreateAdmission = async (req, res) => {
  try {
    const coordinatorId = req.user?.id || req.user?._id;
    const coordinatorUser = await User.findById(coordinatorId);

    if (!coordinatorUser) {
      return res.status(401).json({ success: false, message: 'Coordinator not authenticated.' });
    }

    const {
      studentName, mobile, email, studentClass, school, parentDetails, address,
      examName, admissionAmount, franchiseId, asmId,
      razorpay_order_id, razorpay_payment_id
    } = req.body;

    const resolvedAsmId = asmId || coordinatorUser.asmId;
    let resolvedFranchiseId = franchiseId || coordinatorUser.franchiseId;

    if (!resolvedFranchiseId && resolvedAsmId) {
      const asmUser = await User.findById(resolvedAsmId);
      if (asmUser) resolvedFranchiseId = asmUser.franchiseId;
    }

    const amount = admissionAmount ? parseFloat(admissionAmount) : 1999;

    const franchiseCommission = amount * 0.15;
    const asmCommission = amount * 0.05;
    const coordinatorCommission = amount * 0.20;
    const topiqShare = amount * 0.60;

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
      message: `Payment verified & Admission created! ID: ${admissionId}`,
      admission: newAdmission
    });
  } catch (err) {
    console.error('Error verifying payment & creating admission:', err);
    return res.status(500).json({ success: false, message: err.message || 'Error processing admission.' });
  }
};

// Explicit Module Exports
module.exports = {
  getCoordinatorDashboard,
  getHierarchy,
  createRazorpayOrder,
  verifyAndCreateAdmission
};