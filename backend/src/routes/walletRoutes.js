const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware to verify token and user role
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'topiq_secret_key_2026');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// 1. Get Wallet Balance & History
router.get('/balance', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('walletBalance bankDetails name email role');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    return res.status(200).json({
      success: true,
      walletBalance: user.walletBalance || 0,
      bankDetails: user.bankDetails || {},
      user: { name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Wallet fetch error:', err);
    return res.status(500).json({ success: false, message: 'Server error while fetching wallet details.' });
  }
});

// 2. Update Bank Details for Withdrawals
router.put('/bank-details', verifyToken, async (req, res) => {
  try {
    const { accountHolderName, accountNumber, ifscCode, bankName } = req.body;
    if (!accountNumber || !ifscCode) {
      return res.status(400).json({ success: false, message: 'Account number and IFSC code are required.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    user.bankDetails = { accountHolderName, accountNumber, ifscCode, bankName };
    await user.save();

    return res.status(200).json({ success: true, message: 'Bank details saved successfully.' });
  } catch (err) {
    console.error('Bank details update error:', err);
    return res.status(500).json({ success: false, message: 'Server error while updating bank details.' });
  }
});

// 3. Request Withdrawal
router.post('/withdraw', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const withdrawalAmount = parseFloat(amount);

    if (!withdrawalAmount || withdrawalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Please specify a valid withdrawal amount.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    if (!user.bankDetails || !user.bankDetails.accountNumber) {
      return res.status(400).json({ success: false, message: 'Please add your bank details before requesting a withdrawal.' });
    }

    if (user.walletBalance < withdrawalAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance for this withdrawal.' });
    }

    // Deduct amount from wallet balance
    user.walletBalance -= withdrawalAmount;
    await user.save();

    // Here you can also log a withdrawal request document if required

    return res.status(200).json({
      success: true,
      message: `Withdrawal request of ₹${withdrawalAmount} submitted successfully. Funds will be credited to your bank account within 3 working days.`,
      remainingBalance: user.walletBalance
    });
  } catch (err) {
    console.error('Withdrawal error:', err);
    return res.status(500).json({ success: false, message: 'Server error during withdrawal request.' });
  }
});

module.exports = router;