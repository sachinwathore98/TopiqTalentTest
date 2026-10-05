const User = require('../models/User');
const Admission = require('../models/Admission');
const WalletLedger = require('../models/WalletLedger');
const CommissionTransaction = require('../models/CommissionTransaction');

// 1. Get Franchisee Dashboard Metrics & Team
exports.getFranchiseDashboard = async (req, res) => {
  try {
    const franchiseId = req.franchiseScope;
    
    const asms = await User.find({ role: 'asm', franchiseId }).select('-password');
    const asmIds = asms.map(a => a._id);
    const coordinators = await User.find({ role: 'coordinator', asmId: { $in: asmIds } }).select('-password');

    const totalAdmissions = await Admission.countDocuments({ franchiseId });
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todaysAdmissions = await Admission.countDocuments({ franchiseId, createdAt: { $gte: todayStart } });
    
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthlyAdmissions = await Admission.countDocuments({ franchiseId, createdAt: { $gte: monthStart } });

    const commissions = await CommissionTransaction.find({ franchiseeId: franchiseId }).sort({ createdAt: -1 });
    const availableWallet = commissions
      .filter(c => c.status === 'Credited')
      .reduce((sum, c) => sum + c.commissionAmount, 0);

    const pendingSettlement = 15000;
    const settledAmount = 26250;

    return res.status(200).json({
      success: true,
      name: req.user.name,
      metrics: {
        myAdmissions: totalAdmissions,
        todaysAdmissions,
        monthlyAdmissions,
        myCommission: availableWallet,
        availableWallet,
        pendingSettlement,
        settledAmount
      },
      asms,
      coordinators,
      commissions
    });
  } catch (err) {
    console.error('Error in getFranchiseDashboard:', err);
    return res.status(500).json({ success: false, message: 'Server error loading dashboard metrics.' });
  }
};

// 2. Provision Downstream User (ASM or Coordinator)
exports.provisionMember = async (req, res) => {
  try {
    const franchiseId = req.franchiseScope;
    const { name, email, password, targetRole, phone, asmId } = req.body;

    if (!['asm', 'coordinator'].includes(targetRole)) {
      return res.status(400).json({ success: false, message: 'Invalid role target for provisioning.' });
    }

    if (targetRole === 'coordinator' && !asmId) {
      return res.status(400).json({ success: false, message: 'Coordinator must be assigned to an ASM.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    const newUser = new User({
      name,
      email,
      password,
      role: targetRole,
      phone,
      franchiseId: targetRole === 'asm' ? franchiseId : undefined,
      asmId: targetRole === 'coordinator' ? asmId : undefined
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: `${targetRole.toUpperCase()} created successfully under your hierarchy.`,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error('Error provisioning member:', err);
    return res.status(500).json({ success: false, message: 'Server error creating team member.' });
  }
};

// 3. Delete / Deactivate Downstream User
exports.removeMember = async (req, res) => {
  try {
    const franchiseId = req.franchiseScope;
    const { userId } = req.params;

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (userToDelete.franchiseId?.toString() !== franchiseId.toString() && 
        userToDelete.asmId?.toString() !== franchiseId.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized: User is outside your hierarchy.' });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({ success: true, message: 'Team member removed successfully.' });
  } catch (err) {
    console.error('Error removing member:', err);
    return res.status(500).json({ success: false, message: 'Server error removing team member.' });
  }
};