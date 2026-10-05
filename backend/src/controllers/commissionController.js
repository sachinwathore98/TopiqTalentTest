const CommissionRule = require('../models/CommissionRule');
const WalletLedger = require('../models/WalletLedger');
const Admission = require('../models/Admission');

async function processAutomaticCommissions(admissionId) {
  const admission = await Admission.findById(admissionId);
  if (!admission || admission.paymentStatus !== 'Success') return;

  // Fetch active rules from Commission Master
  const rules = await CommissionRule.find({ isActive: true });
  const ruleMap = {};
  rules.forEach(r => ruleMap[r.role] = r.percentage);

  const fPct = ruleMap['franchisee'] || 15;
  const aPct = ruleMap['asm'] || 5;
  const cPct = ruleMap['coordinator'] || 20;

  const baseAmount = admission.admissionAmount;
  const fComm = (baseAmount * fPct) / 100;
  const aComm = (baseAmount * aPct) / 100;
  const cComm = (baseAmount * cPct) / 100;
  const companyShare = baseAmount - (fComm + aComm + cComm);

  // Update admission commission records
  admission.franchiseeCommission = fComm;
  admission.asmCommission = aComm;
  admission.coordinatorCommission = cComm;
  admission.companyShare = companyShare;
  await admission.save();

  // Helper to create immutable wallet ledger credit with idempotency
  async function creditWallet(userId, role, pct, comm) {
    if (!userId) return;
    const idempotencyKey = `${admission._id}_${role}_${pct}`;
    try {
      const existing = await WalletLedger.findOne({ idempotencyKey });
      if (!existing) {
        await WalletLedger.create({
          userId,
          role,
          admissionId: admission._id,
          calculationBase: baseAmount,
          percentage: pct,
          commissionAmount: comm,
          transactionType: 'CREDIT',
          status: 'Credited',
          idempotencyKey
        });
      }
    } catch (err) {
      console.error(`Error crediting wallet for ${role}:`, err);
    }
  }

  await creditWallet(admission.franchiseeId, 'franchisee', fPct, fComm);
  await creditWallet(admission.asmId, 'asm', aPct, aComm);
  await creditWallet(admission.coordinatorId, 'coordinator', cPct, cComm);
}

module.exports = { processAutomaticCommissions };