const User = require('../models/User');
const Admission = require('../models/Admission');

// Get Coordinator Dashboard Metrics
exports.getCoordinatorDashboard = async (req, res) => {
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

// Get Upstream Hierarchy (Franchises & ASMs) for Coordinator Assignment
exports.getHierarchy = async (req, res) => {
  try {
    const franchises = await User.find({ role: { $in: ['franchise', 'franchise_owner'] } }).select('name _id').lean();
    const asms = await User.find({ role: 'asm' }).select('name _id franchiseId').lean();
    return res.status(200).json({ success: true, franchises, asms });
  } catch (err) {
    console.error('Error fetching hierarchy:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching hierarchy.' });
  }
};

// Create Admission with Upstream Commission Distribution
exports.createAdmission = async (req, res) => {
  try {
    const coordinatorId = req.user?.id || req.user?._id;
    const coordinatorUser = await User.findById(coordinatorId);

    if (!coordinatorUser) {
      return res.status(401).json({ success: false, message: 'Coordinator not authenticated.' });
    }

    const {
      studentName, mobile, email, studentClass, school, parentDetails, address,
      examName, admissionAmount, paymentMethod, franchiseId, asmId
    } = req.body;

    // Resolve Upstream Hierarchy
    const resolvedAsmId = asmId || coordinatorUser.asmId;
    let resolvedFranchiseId = franchiseId || coordinatorUser.franchiseId;

    if (!resolvedFranchiseId && resolvedAsmId) {
      const asmUser = await User.findById(resolvedAsmId);
      if (asmUser) resolvedFranchiseId = asmUser.franchiseId;
    }

    const amount = admissionAmount ? parseFloat(admissionAmount) : 1999;

    // Multi-tier commission distribution
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
      paymentId: `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
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
      message: `Admission created successfully! ID: ${admissionId}`,
      admission: newAdmission
    });
  } catch (err) {
    console.error('Error creating admission:', err);
    return res.status(500).json({ success: false, message: err.message || 'Error processing admission.' });
  }
};