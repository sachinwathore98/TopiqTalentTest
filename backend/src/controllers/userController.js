const MultiRoleUser = require('../models/MultiRoleUserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Login Controller
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await MultiRoleUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    // Fallback enabled: accepts exact plaintext match or valid bcrypt hash match
    const isMatch = (password === user.password) || (await bcrypt.compare(password, user.password));
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, franchiseId: user.franchiseId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Explicitly sending role and user metadata back for frontend session storage
    res.status(200).json({
      success: true,
      token,
      role: user.role,
      name: user.name,
      franchiseId: user.franchiseId
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// Hierarchical User Creation Controller
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, targetRole, franchiseId } = req.body;

    // Check if user already exists
    const existingUser = await MultiRoleUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    // Hash password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // If a franchise owner creates a student, inherit the franchise ID automatically
    const assignedFranchiseId = req.user.role === 'franchise_owner' 
      ? req.user.franchiseId 
      : (franchiseId || null);

    const newUser = new MultiRoleUser({
      name,
      email,
      password: hashedPassword,
      role: targetRole,
      franchiseId: assignedFranchiseId
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: `Successfully created ${targetRole} account for ${name}.`,
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        franchiseId: newUser.franchiseId
      }
    });

  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({ success: false, message: 'Server error while creating user account.' });
  }
};