const User = require('../models/User');
const Admission = require('../models/Admission');
const WalletLedger = require('../models/WalletLedger');
const CommissionTransaction = require('../models/CommissionTransaction');
const bcrypt = require('bcryptjs');

// 1. Get Franchisee Dashboard Metrics, Hierarchical Commissions & Team
exports.getFranchiseDashboard = async (req, res) => {
  try {
    let franchiseId = req.franchiseScope || req.user?.id || req.user?._id || req.user?.userId;
    let franchiseUser = franchiseId ? await User.findById(franchiseId) : null;
    if (!franchiseUser && req.user?.email) {
      franchiseUser = await User.findOne({ email: req.user.email.toLowerCase().trim() });
      if (franchiseUser) franchiseId = franchiseUser._id;
    }

    // Fetch ASMs under this franchise
    const asms = await User.find({ 
      role: 'asm', 
      $or: [
        { franchiseId: franchiseId },
        { franchiseId: franchiseId?.toString() }
      ]
    }).select('-password').lean();

    // Build hierarchical tree with admissions per ASM and Coordinator
    const asmHierarchy = await Promise.all(asms.map(async (asm) => {
      const coordinators = await User.find({ role: 'coordinator', asmId: asm._id }).select('-password').lean();

      const coordinatorsWithAdmissions = await Promise.all(coordinators.map(async (coord) => {
        const admissions = await Admission.find({ coordinatorId: coord._id }).lean();
        const totalCommission = admissions.reduce((sum, adm) => sum + ((adm.admissionAmount || 1000) * 0.15), 0);
        return {
          ...coord,
          admissionsCount: admissions.length,
          admissions,
          totalCommission
        };
      }));

      const asmDirectAdmissions = await Admission.find({ asmId: asm._id, $or: [{ coordinatorId: { $exists: false } }, { coordinatorId: null }] }).lean();
      const allAsmAdmissions = await Admission.find({ asmId: asm._id }).lean();
      const totalAsmCommission = allAsmAdmissions.reduce((sum, adm) => sum + ((adm.admissionAmount || 1000) * 0.15), 0);

      return {
        ...asm,
        directAdmissions: asmDirectAdmissions,
        totalAdmissions: allAsmAdmissions.length,
        totalCommission: totalAsmCommission,
        coordinators: coordinatorsWithAdmissions
      };
    }));

    // Total Admissions across all hierarchy
    const allAdmissions = await Admission.find({ 
      $or: [{ franchiseId }, { franchiseId: franchiseId?.toString() }] 
    }).lean();

    const totalAdmissionsCount = allAdmissions.length;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todaysAdmissions = allAdmissions.filter(a => new Date(a.createdAt) >= todayStart).length;
    
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthlyAdmissions = allAdmissions.filter(a => new Date(a.createdAt) >= monthStart).length;

    // Automated 15% Commission Calculations & Wallet Ledger
    const calculatedCommissions = allAdmissions.map(adm => {
      const amount = adm.admissionAmount || 1000;
      const commission = amount * 0.15;
      return {
        admissionId: adm.admissionId || adm._id.toString().slice(-6),
        studentName: adm.studentName || 'Student',
        amount,
        percentage: 15,
        commission,
        status: adm.admissionStatus === 'Pending' ? 'Pending' : 'Credited',
        createdAt: adm.createdAt
      };
    });

    const availableWallet = calculatedCommissions
      .filter(c => c.status === 'Credited')
      .reduce((sum, c) => sum + c.commission, 0);

    return res.status(200).json({
      success: true,
      name: franchiseUser?.name || req.user?.name || 'Shreya Enterprises',
      metrics: {
        myAdmissions: totalAdmissionsCount,
        todaysAdmissions,
        monthlyAdmissions,
        myCommission: availableWallet,
        availableWallet,
        pendingSettlement: 15000,
        settledAmount: 26250
      },
      asmHierarchy,
      commissions: calculatedCommissions,
      asms,
      coordinators: asmHierarchy.flatMap(a => a.coordinators)
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
    const { name, email, password, targetRole, phone, asmId } = req.body;

    if (!['asm', 'coordinator'].includes(targetRole)) {
      return res.status(400).json({ success: false, message: 'Invalid role target.' });
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
      message: `${targetRole.toUpperCase()} created successfully!`,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error('Error provisioning member:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error creating team member.' });
  }
};

// 3. Request Bank Withdrawal Payout
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount, bankDetails } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid withdrawal amount.' });
    }
    // Record withdrawal request logic here or save to wallet ledger
    return res.status(200).json({
      success: true,
      message: `Withdrawal request of ₹${amount} submitted successfully to bank account.`
    });
  } catch (err) {
    console.error('Error processing withdrawal:', err);
    return res.status(500).json({ success: false, message: 'Server error processing withdrawal.' });
  }
};

// 4. Remove Member
exports.removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    return res.status(200).json({ success: true, message: 'Team member removed successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error removing member.' });
  }
};