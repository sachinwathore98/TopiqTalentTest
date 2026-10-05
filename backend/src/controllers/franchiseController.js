const User = require('../models/User');
const Admission = require('../models/Admission');
const WalletLedger = require('../models/WalletLedger');
const CommissionTransaction = require('../models/CommissionTransaction');
const bcrypt = require('bcryptjs');

// 1. Get Franchisee Dashboard Metrics & Team
exports.getFranchiseDashboard = async (req, res) => {
  try {
    let franchiseId = req.franchiseScope || req.user?.id || req.user?._id || req.user?.userId;
    let franchiseUser = franchiseId ? await User.findById(franchiseId) : null;
    if (!franchiseUser && req.user?.email) {
      franchiseUser = await User.findOne({ email: req.user.email.toLowerCase().trim() });
      if (franchiseUser) franchiseId = franchiseUser._id;
    }

    // Fetch ASMs
    const asms = await User.find({ 
      role: 'asm', 
      $or: [
        { franchiseId: franchiseId },
        { franchiseId: franchiseId?.toString() },
        ...(franchiseUser ? [{ franchiseId: franchiseUser._id.toString() }] : [])
      ]
    }).select('-password').lean();

    // For each ASM, attach coordinators and admission counts
    const asmHierarchy = await Promise.all(asms.map(async (asm) => {
      // Find coordinators under this ASM
      const coordinators = await User.find({ 
        role: 'coordinator', 
        asmId: asm._id 
      }).select('-password').lean();

      // Coordinator admission counts
      const coordinatorsWithAdmissions = await Promise.all(coordinators.map(async (coord) => {
        const coordAdmissionsCount = await Admission.countDocuments({ coordinatorId: coord._id });
        const coordAdmissionsList = await Admission.find({ coordinatorId: coord._id }).lean();
        return {
          ...coord,
          admissionsCount: coordAdmissionsCount,
          admissions: coordAdmissionsList
        };
      }));

      // ASM direct admissions + sum of coordinator admissions
      const asmDirectAdmissionsCount = await Admission.countDocuments({ asmId: asm._id, coordinatorId: { $exists: false } });
      const totalAsmAdmissions = await Admission.countDocuments({ asmId: asm._id });
      const asmAdmissionsList = await Admission.find({ asmId: asm._id }).lean();

      return {
        ...asm,
        totalAdmissions: totalAsmAdmissions,
        admissions: asmAdmissionsList,
        coordinators: coordinatorsWithAdmissions
      };
    }));

    const totalAdmissions = await Admission.countDocuments({ 
      $or: [{ franchiseId }, { franchiseId: franchiseId?.toString() }] 
    });

    const commissions = await CommissionTransaction.find({ 
      $or: [{ franchiseeId: franchiseId }, { franchiseId: franchiseId }] 
    }).sort({ createdAt: -1 }).lean();

    const availableWallet = commissions
      .filter(c => c.status === 'Credited')
      .reduce((sum, c) => sum + (c.commissionAmount || c.credit || 0), 0);

    return res.status(200).json({
      success: true,
      name: franchiseUser?.name || req.user?.name || 'Franchise Partner',
      metrics: {
        myAdmissions: totalAdmissions,
        todaysAdmissions: 0,
        monthlyAdmissions: totalAdmissions,
        myCommission: availableWallet,
        availableWallet,
        pendingSettlement: 15000,
        settledAmount: 26250
      },
      asmHierarchy, // Structured tree
      asms,
      coordinators: asmHierarchy.flatMap(a => a.coordinators),
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
    let franchiseId = req.franchiseScope || req.user?.id || req.user?._id || req.user?.userId;
    if (!franchiseId && req.user?.email) {
      const fUser = await User.findOne({ email: req.user.email.toLowerCase().trim() });
      if (fUser) franchiseId = fUser._id;
    }

    const { name, email, password, targetRole, phone, asmId } = req.body;

    if (!['asm', 'coordinator'].includes(targetRole)) {
      return res.status(400).json({ success: false, message: 'Invalid role target for provisioning.' });
    }

    if (targetRole === 'coordinator' && !asmId) {
      return res.status(400).json({ success: false, message: 'Coordinator must be assigned to an ASM.' });
    }

    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password || 'topiq123', 10);

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: targetRole,
      phone: phone || '',
      franchiseId: franchiseId,
      asmId: targetRole === 'coordinator' ? asmId : undefined,
      status: 'active'
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: `${targetRole.toUpperCase()} created successfully under your hierarchy.`,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error('Error provisioning member:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error creating team member.' });
  }
};

// 3. Delete Downstream User
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ success: true, message: 'Team member removed successfully.' });
  } catch (err) {
    console.error('Error removing member:', err);
    return res.status(500).json({ success: false, message: 'Server error removing team member.' });
  }
};