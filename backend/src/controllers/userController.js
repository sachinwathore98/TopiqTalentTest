const MultiRoleUser = require('../models/MultiRoleUserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await MultiRoleUser.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    // Generate JWT token containing id, role, and franchiseId
    const token = jwt.sign(
      { id: user._id, role: user.role, franchiseId: user.franchiseId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

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