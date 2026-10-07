const Admission = require('../models/Admission');
const WalletLedger = require('../models/WalletLedger');
const User = require('../models/User');

// Process Automatic Commission Splits upon Successful Payment
async function processAutomaticCommissions(admissionId) {
  const admission = await Admission.findById(admissionId);
  if (!admission || admission.paymentStatus !== 'Paid') return;

  const baseAmount = admission.admissionAmount || 1999;

  // Exact Commission Percentages: Franchisee 15%, ASM 5%, Coordinator 20%, Company 60%
  const fComm = baseAmount * 0.15;
  const aComm = baseAmount * 0.05;
  const cComm = baseAmount * 0.20;
  const topiqShare = baseAmount * 0.60;

  admission.franchiseCommission = fComm;
  admission.asmCommission = aComm;
  admission.coordinatorCommission = cComm;
  admission.topiqShare = topiqShare;
  await admission.save();

  // Helper to safely write immutable CREDIT ledger entries
  async function creditWalletLedger(userId, role, percentage, commAmount) {
    if (!userId) return;
    const idempotencyKey = `${admission._id}_${role}_${percentage}_CREDIT`;
    
    const existing = await WalletLedger.findOne({ idempotencyKey });
    if (!existing) {
      await WalletLedger.create({
        userId,
        role,
        admissionId: admission._id,
        calculationBase: baseAmount,
        percentage,
        commissionAmount: commAmount,
        transactionType: 'CREDIT',
        status: 'Credited',
        idempotencyKey
      });

      // Update user cached balance from ledger sum
      await recalculateUserWallet(userId);
    }
  }

  if (admission.franchiseId) await creditWalletLedger(admission.franchiseId, 'franchisee', 15, fComm);
  if (admission.asmId) await creditWalletLedger(admission.asmId, 'asm', 5, aComm);
  if (admission.coordinatorId) await creditWalletLedger(admission.coordinatorId, 'coordinator', 20, cComm);
}

// Process Reversals / Refunds with Immutable Audit Trail
async function processReversal(admissionId) {
  const admission = await Admission.findById(admissionId);
  if (!admission) return;

  const baseAmount = admission.admissionAmount || 1999;
  const fComm = admission.franchiseCommission || (baseAmount * 0.15);
  const aComm = admission.asmCommission || (baseAmount * 0.05);
  const cComm = admission.coordinatorCommission || (baseAmount * 0.20);

  async function debitWalletLedger(userId, role, percentage, commAmount) {
    if (!userId) return;
    const idempotencyKey = `${admission._id}_${role}_${percentage}_REVERSAL`;
    
    const existing = await WalletLedger.findOne({ idempotencyKey });
    if (!existing) {
      await WalletLedger.create({
        userId,
        role,
        admissionId: admission._id,
        calculationBase: baseAmount,
        percentage,
        commissionAmount: commAmount,
        transactionType: 'REVERSAL',
        status: 'Reversed',
        idempotencyKey
      });

      await recalculateUserWallet(userId);
    }
  }

  if (admission.franchiseId) await debitWalletLedger(admission.franchiseId, 'franchisee', 15, fComm);
  if (admission.asmId) await debitWalletLedger(admission.asmId, 'asm', 5, aComm);
  if (admission.coordinatorId) await debitWalletLedger(admission.coordinatorId, 'coordinator', 20, cComm);

  admission.refundStatus = 'Processed';
  admission.admissionStatus = 'Cancelled';
  await admission.save();
}

// Recalculate user wallet balance strictly from ledger sums
async function recalculateUserWallet(userId) {
  const ledgerEntries = await WalletLedger.find({ userId });
  const totalBalance = ledgerEntries.reduce((sum, entry) => {
    if (entry.transactionType === 'CREDIT') return sum + entry.commissionAmount;
    if (entry.transactionType === 'REVERSAL' || entry.transactionType === 'DEBIT') return sum - entry.commissionAmount;
    return sum;
  }, 0);

  await User.findByIdAndUpdate(userId, { walletBalance: Math.max(0, totalBalance) });
}

module.exports = { processAutomaticCommissions, processReversal, recalculateUserWallet };