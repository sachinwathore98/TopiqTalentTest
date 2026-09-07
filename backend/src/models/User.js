const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['super_admin', 'admin', 'asm', 'franchise', 'agent', 'student'], 
    required: true 
  },
  status: { type: String, enum: ['active', 'deactivated'], default: 'active' },
  
  // Hierarchy tracking references
  assignedASM: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedFranchise: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  // Wallet & Earnings
  walletBalance: { type: Number, default: 0 },
  bankDetails: {
    accountHolderName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscCode: { type: String, default: '' },
    bankName: { type: String, default: '' }
  },

  // OTP Verification for Password Management
  otpCode: { type: String, default: null },
  otpExpires: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);