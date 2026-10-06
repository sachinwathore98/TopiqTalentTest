const User = require('../models/User');
const Admission = require('../models/Admission');

exports.getCoordinatorDashboard = async (req, res) => {
  try {
    const coordinatorId = req.user?.id || req.user?._id;
    const coordUser = await User.findById(coordinatorId);

    // Find admissions registered by this coordinator
    const admissions = await Admission.find({ coordinatorId }).lean();

    const totalAdmissionsCount = admissions.length;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todaysAdmissions = admissions.filter(a => new Date(a.createdAt) >= todayStart).length;
    
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthlyAdmissions = admissions.filter(a => new Date(a.createdAt) >= monthStart).length;

    // Automated 20% commission calculation (e.g. ₹1,000 * 20% = ₹200 per admission)
    const totalCommission = admissions.reduce((sum, adm) => sum + ((adm.admissionAmount || 1000) * 0.20), 0);
    const availableWallet = totalCommission * 0.85;

    return res.status(200).json({
      success: true,
      name: coordUser?.name || 'Coordinator Partner',
      metrics: {
        totalAdmissions: totalAdmissionsCount,
        todaysAdmissions,
        monthlyAdmissions,
        totalCommission,
        availableWallet,
        pendingSettlement: 2500,
        settledAmount: 8500
      },
      admissions
    });
  } catch (err) {
    console.error('Error in getCoordinatorDashboard:', err);
    return res.status(500).json({ success: false, message: 'Server error loading coordinator dashboard.' });
  }
};