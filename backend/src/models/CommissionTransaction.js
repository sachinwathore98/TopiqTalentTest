const mongoose = require('mongoose');

const commissionTransactionSchema = new mongoose.Schema({
  admissionId: { type: String, required: true },
  franchiseeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  percentage: { type: String, default: '15%' },
  commissionAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Credited', 'Settled', 'Reversed'], default: 'Credited' },
}, { timestamps: true });

module.exports = mongoose.model('CommissionTransaction', commissionTransactionSchema);