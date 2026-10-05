const mongoose = require('mongoose');

const walletLedgerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, required: true, enum: ['franchisee', 'asm', 'coordinator'] },
  admissionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admission', required: true },
  calculationBase: { type: Number, required: true },
  percentage: { type: Number, required: true },
  commissionAmount: { type: Number, required: true },
  transactionType: { type: String, default: 'CREDIT', enum: ['CREDIT', 'REVERSAL', 'DEBIT'] },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Credited', 'Eligible', 'Processing', 'Settled', 'Failed', 'Reversed'] },
  idempotencyKey: { type: String, required: true, unique: true }, // Prevents duplicate credits
}, { timestamps: true });

module.exports = mongoose.model('WalletLedger', walletLedgerSchema);