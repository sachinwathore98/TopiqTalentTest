const User = require('../models/User');
const Admission = require('../models/Admission');
const bcrypt = require('bcryptjs');

exports.getASMDashboard = async (req, res) => {
  try {
    const asmId = req.user?.id || req.user?._id;
    const asmUser = await User.findById(asmId);

    // Fetch ONLY coordinators assigned strictly to this ASM ID
    const coordinators = await User.find({ 
      role: 'coordinator', 
      $or: [
        { asmId }, 
        { asmId: asmId?.toString() }
      ] 
    }).select('-password').lean();

    const coordIds = coordinators.map(c => c._id);

    const admissions = await Admission.find({ 
      $or: [
        { coordinatorId: { $in: coordIds } },
        { asmId: asmId },
        { asmId: asmId?.toString() }
      ]
    }).lean();

    const coordinatorsWithMetrics = await Promise.all(coordinators.map(async (coord) => {
      const coordAdmissions = await Admission.find({ 
        $or: [
          { coordinatorId: coord._id }, 
          { coordinatorId: coord._id?.toString() }
        ] 
      }).lean();
      
      const totalCoordRevenue = coordAdmissions.reduce((sum, adm) => sum + (adm.admissionAmount || 1999), 0);
      const coordinatorCommission = totalCoordRevenue * 0.20;

      return {
        ...coord,
        admissionsCount: coordAdmissions.length,
        totalRevenue: totalCoordRevenue,
        coordinatorCommission,
        admissions: coordAdmissions
      };
    }));

    const totalRevenue = admissions.reduce((sum, adm) => sum + (adm.admissionAmount || 1999), 0);
    const totalCommission = admissions.reduce((sum, adm) => {
      return sum + (adm.asmCommission || ((adm.admissionAmount || 1999) * 0.05));
    }, 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todaysAdmissions = admissions.filter(a => new Date(a.createdAt) >= todayStart).length;
    
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthlyAdmissions = admissions.filter(a => new Date(a.createdAt) >= monthStart).length;

    const availableWallet = totalCommission * 0.85;

    return res.status(200).json({
      success: true,
      name: asmUser?.name || 'ASM Partner',
      metrics: {
        totalAdmissions: admissions.length,
        todaysAdmissions,
        monthlyAdmissions,
        coordinatorsCount: coordinators.length,
        totalRevenue,
        totalCommission,
        availableWallet,
        pendingSettlement: totalCommission * 0.15,
        settledAmount: totalCommission * 0.85
      },
      coordinators: coordinatorsWithMetrics,
      admissions: admissions.map(adm => ({
        ...adm,
        coordinatorName: coordinators.find(c => c._id.toString() === adm.coordinatorId?.toString())?.name || 'Direct ASM Student'
      }))
    });
  } catch (err) {
    console.error('Error in getASMDashboard:', err);
    return res.status(500).json({ success: false, message: 'Server error loading ASM dashboard.' });
  }
};

exports.provisionCoordinator = async (req, res) => {
  try {
    const asmId = req.user?.id || req.user?._id;
    const asmUser = await User.findById(asmId);
    const { name, email, password, phone } = req.body;

    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password || 'topiq123', 10);
    const newCoord = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'coordinator',
      phone: phone || '',
      asmId,
      franchiseId: asmUser?.franchiseId,
      status: 'active'
    });

    await newCoord.save();
    return res.status(201).json({ success: true, message: 'Coordinator created and strictly linked to ASM successfully!' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Error creating coordinator.' });
  }
};

exports.updateCoordinator = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, status } = req.body;
    await User.findByIdAndUpdate(userId, { name, email, phone, status });
    return res.status(200).json({ success: true, message: 'Coordinator updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error updating coordinator.' });
  }
};

exports.deleteCoordinator = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ success: true, message: 'Coordinator deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error deleting coordinator.' });
  }
};

exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid withdrawal amount.' });
    }
    return res.status(200).json({
      success: true,
      message: `Withdrawal request of ₹${amount} submitted successfully.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error processing withdrawal.' });
  }
};