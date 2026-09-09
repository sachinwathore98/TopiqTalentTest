const mongoose = require('mongoose');

const examConfigSchema = new mongoose.Schema({
  className: { type: String, required: true, unique: true },
  testFee: { type: Number, required: true }, // Serves as the main active offer price
  originalFee: { type: Number, default: 0 },   // Real / Strikethrough price
  passingMarks: { type: Number, default: 40 },
  totalMarks: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ExamConfig', examConfigSchema);