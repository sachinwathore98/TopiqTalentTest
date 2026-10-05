const User = require('../models/User');
let Admission;
try { Admission = require('../models/Admission'); } catch(e) { Admission = null; }
const Banner = require('../models/Banner');
const Enquiry = require('../models/Enquiry');
const ScholarshipPrize = require('../models/ScholarshipPrize');
const bcrypt = require('bcryptjs');

// 1. Get All Metrics & Dashboard Summary
exports.getMetrics = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    const admissions = Admission ? await Admission.find({}) : [];
    const enquiries = await Enquiry.find({});

    const totalRevenue = admissions.reduce((sum, a) => sum + (a.admissionAmount || 1000), 0);
    const activePartnersCount = users.filter(u => ['franchise', 'franchise_owner', 'asm', 'agent'].includes(u.role)).length;
    const pendingEnquiriesCount = enquiries.filter(e => e.status === 'Pending').length;

    // Revenue breakdowns
    const revenueByFranchise = {};
    const revenueByASM = {};
    const revenueByAgent = {};

    admissions.forEach(adm => {
      if (adm.franchiseId) {
        revenueByFranchise[adm.franchiseId] = (revenueByFranchise[adm.franchiseId] || 0) + (adm.admissionAmount || 1000);
      }
      if (adm.asmId) {
        revenueByASM[adm.asmId] = (revenueByASM[adm.asmId] || 0) + (adm.admissionAmount || 1000);
      }
      if (adm.agentId) {
        revenueByAgent[adm.agentId] = (revenueByAgent[adm.agentId] || 0) + (adm.admissionAmount || 1000);
      }
    });

    return res.status(200).json({
      success: true,
      metrics: {
        totalRevenue,
        totalAdmissions: admissions.length,
        activePartnersCount,
        pendingEnquiriesCount,
        breakdown: { revenueByFranchise, revenueByASM, revenueByAgent }
      }
    });
  } catch (err) {
    console.error('Error fetching metrics:', err);
    return res.status(500).json({ success: false, message: 'Server error loading metrics.' });
  }
};

// 2. Get All Admissions
exports.getAllAdmissions = async (req, res) => {
  try {
    const admissions = Admission ? await Admission.find({}).sort({ createdAt: -1 }) : [];
    return res.status(200).json({ success: true, admissions });
  } catch (err) {
    console.error('Error fetching admissions:', err);
    return res.status(500).json({ success: false, admissions: [] });
  }
};

// 3. Get All Users with Hierarchy Tree structure
exports.getAllUsersHierarchy = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    const franchisees = users.filter(u => u.role === 'franchise' || u.role === 'franchise_owner');
    const asms = users.filter(u => u.role === 'asm');
    const coordinators = users.filter(u => u.role === 'coordinator');
    const agents = users.filter(u => u.role === 'agent');

    const tree = franchisees.map(franchise => {
      const franchiseAsms = asms.filter(a => a.franchiseId?.toString() === franchise._id.toString());
      const mappedAsms = franchiseAsms.map(asm => {
        const asmCoordinators = coordinators.filter(c => c.asmId?.toString() === asm._id.toString());
        return { ...asm.toObject(), coordinators: asmCoordinators };
      });
      return { ...franchise.toObject(), asms: mappedAsms };
    });

    return res.status(200).json({
      success: true,
      users,
      tree,
      counts: {
        total: users.length,
        franchises: franchisees.length,
        asms: asms.length,
        coordinators: coordinators.length,
        agents: agents.length
      }
    });
  } catch (err) {
    console.error('Error fetching hierarchy users:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving hierarchy users.' });
  }
};

// 4. Provision Hierarchical Account (SuperAdmin)
exports.provisionHierarchicalAccount = async (req, res) => {
  try {
    const { name, email, password, targetRole, role, franchiseId, asmId, phone, city, state, gstNumber } = req.body;
    const finalRole = targetRole || role;

    if (!name || !email || !password || !finalRole) {
      return res.status(400).json({ success: false, message: 'Missing required account fields.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered in the system.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: finalRole,
      franchiseId: franchiseId || null,
      asmId: asmId || null,
      phone: phone || '',
      city: city || '',
      state: state || 'Maharashtra',
      gstNumber: gstNumber || '',
      status: 'active'
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: `Successfully provisioned ${finalRole.toUpperCase()} account for ${name}!`,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    console.error('Error provisioning hierarchical account:', err);
    return res.status(500).json({ success: false, message: 'Server error creating hierarchical account.' });
  }
};

// 5. Edit User Details
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, city, state, role, franchiseId, asmId, gstNumber, status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone !== undefined ? phone : user.phone;
    user.city = city !== undefined ? city : user.city;
    user.state = state !== undefined ? state : user.state;
    if (role) user.role = role;
    if (gstNumber !== undefined) user.gstNumber = gstNumber;
    if (status !== undefined) user.status = status;
    if (franchiseId !== undefined) user.franchiseId = franchiseId || null;
    if (asmId !== undefined) user.asmId = asmId || null;

    await user.save();

    return res.status(200).json({ success: true, message: 'User account updated successfully.' });
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ success: false, message: 'Server error updating user.' });
  }
};

// 6. Toggle User Status (Active / Deactivated)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.status = status;
    await user.save();

    return res.status(200).json({ success: true, message: `User status updated to ${status}.` });
  } catch (err) {
    console.error('Error updating user status:', err);
    return res.status(500).json({ success: false, message: 'Server error updating status.' });
  }
};

// 7. Delete User
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.status(200).json({ success: true, message: 'User account permanently deleted.' });
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting user.' });
  }
};