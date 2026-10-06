const User = require('../models/User');
const Admission = require('../models/Admission');

exports.getASMDashboard = async (req, res) => {
  try {
    const asmId = req.user?.id || req.user?._id;
    const asmUser = await User.findById(asmId);

    // Find coordinators assigned to this ASM
    const coordinators = await User.find({ role: 'coordinator', asmId }).select('-password').lean();
    const coordIds = coordinators.map(c => c._id);

    // Find admissions under these coordinators
    const admissions = await Admission.find({ 
      $or: [
        { coordinatorId: { $in: coordIds } },
        { asmId: asmId }
      ]
    }).lean();

    const coordinatorsWithCounts = await Promise.all(coordinators.map(async (coord) => {
      const count = await Admission.countDocuments({ coordinatorId: coord._id });
      return { ...coord, admissionsCount: count };
    }));

    const totalAdmissionsCount = admissions.length;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todaysAdmissions = admissions.filter(a => new Date(a.createdAt) >= todayStart).length;
    
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthlyAdmissions = admissions.filter(a => new Date(a.createdAt) >= monthStart).length;

    // Automated 5% Commission calculation (e.g. ₹1,000 * 5% = ₹50 per admission)
    const totalCommission = admissions.reduce((sum, adm) => sum + ((adm.admissionAmount || 1000) * 0.05), 0);
    const availableWallet = totalCommission * 0.74; // Simulated available balance

    return res.status(200).json({
      success: true,
      name: asmUser?.name || 'ASM Partner',
      metrics: {
        totalAdmissions: totalAdmissionsCount,
        todaysAdmissions,
        monthlyAdmissions,
        coordinatorsCount: coordinators.length,
        totalCommission,
        availableWallet,
        pendingSettlement: 6500,
        settledAmount: 12000
      },
      coordinators: coordinatorsWithCounts,
      admissions: admissions.map(adm => ({
        ...adm,
        coordinatorName: coordinators.find(c => c._id.toString() === adm.coordinatorId?.toString())?.name || 'Direct ASM'
      }))
    });
  } catch (err) {
    console.error('Error in getASMDashboard:', err);
    return res.status(500).json({ success: false, message: 'Server error loading ASM dashboard.' });
  }
};