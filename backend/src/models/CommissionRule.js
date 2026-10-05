const mongoose = require('mongoose');

const commissionRuleSchema = new mongoose.Schema({
  role: { type: String, required: true, unique: true, enum: ['franchisee', 'asm', 'coordinator', 'company'] },
  percentage: { type: Number, required: true }, // e.g. 15, 5, 20, 60
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('CommissionRule', commissionRuleSchema);