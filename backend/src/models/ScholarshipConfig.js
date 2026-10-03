const mongoose = require('mongoose');

const scholarshipConfigSchema = new mongoose.Schema({
  rankTier: { type: String, required: true, unique: true }, // e.g. "Rank 1–10"
  cashAmount: { type: Number, required: true },              // e.g. 11111
  label: { type: String, default: 'State Scholar' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ScholarshipConfig', scholarshipConfigSchema);