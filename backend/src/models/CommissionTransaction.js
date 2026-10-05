const mongoose = require('mongoose');

const commissionTransactionSchema = new mongoose.Schema({
  admissionId: { type: String, required: true },
  franchiseeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  asmId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  amount: { type: Number, required: true }, // Total admission amount
  percentage: { type: String, required: true }, // e.g., '15%', '5%', '20%'
  commissionAmount: { type: Number, required: true }, // Calculated split amount
  status: { type: String, enum: ['Pending', 'Credited', 'Settled', 'Reversed', 'Cancelled'], default: 'Credited' },
}, { timestamps: true });

// Add compound indexes for high-performance hierarchy scoping
commissionTransactionSchema.index({ franchiseeId: 1, createdAt: -1 });
commissionTransactionSchema.index({ asmId: 1, createdAt: -1 });
commissionTransactionSchema.index({ coordinatorId: 1, createdAt: -1 });

module.exports = mongoose.model('CommissionTransaction', commissionTransactionSchema);