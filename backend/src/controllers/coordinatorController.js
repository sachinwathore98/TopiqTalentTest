const User = require('../models/User');
const Admission = require('../models/Admission');
const Exam = require('../models/Exam'); // Assuming you have an Exam model for live rates

// 1. Get Coordinator Dashboard Metrics & Isolated Admissions
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

// 2. Create Admission with Live Rate Sync & Multi-Tier Upstream Commission Distribution
exports.createAdmission = async (req, res) => {
  try {
    const coordinatorId = req.user?.id || req.user?._id;
    const coordinatorUser = await User.findById(coordinatorId);

    if (!coordinatorUser) {
      return res.status(401).json({ success: false, message: 'Coordinator not authenticated.' });
    }

    const {
      studentName, mobile, email, studentClass, school, parentDetails, address,
      examName, examCategory, examYear, examDate, admissionAmount, paymentMethod
    } = req.body;

    // Resolve Upstream Hierarchy: Coordinator -> ASM -> Franchisee
    const asmId = coordinatorUser.asmId;
    let franchiseId = coordinatorUser.franchiseId;

    if (!franchiseId && asmId) {
      const asmUser = await User.findById(asmId);
      if (asmUser) franchiseId = asmUser.franchiseId;
    }

    // Fetch live rate if examName matches configured exams, else default to provided amount
    let amount = admissionAmount ? parseFloat(admissionAmount) : 1000;
    if (examName) {
      const liveExam = await Exam.findOne({ title: new RegExp(`^${examName}$`, 'i') });
      if (liveExam && liveExam.fee) {
        amount = liveExam.fee;
      }
    }

    // Generate unique Admission ID (e.g., TOPIQ-ADM-000001)
    const count = await Admission.countDocuments();
    const admissionId = `TOPIQ-ADM-${String(count + 1).padStart(6, '0')}`;

    // Multi-tier commission distribution set by admin/system rules
    // Franchise: 15%, ASM: 5%, Coordinator: 20%, TOPIQ Platform Share: 60%
    const franchiseCommission = amount * 0.15;
    const asmCommission = amount * 0.05;
    const coordinatorCommission = amount * 0.20;
    const topiqShare = amount * 0.60;

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
      examCategory: examCategory || 'General',
      examYear: examYear || '2026',
      examDate: examDate ? new Date(examDate) : new Date(),
      franchiseId,
      asmId,
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
      message: `Admission created successfully and commissions distributed upstream! ID: ${admissionId}`,
      admission: newAdmission
    });
  } catch (err) {
    console.error('Error creating admission:', err);
    return res.status(500).json({ success: false, message: err.message || 'Error processing admission.' });
  }
};