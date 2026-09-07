const mongoose = require('mongoose');

const examConfigSchema = new mongoose.Schema({
  className: { type: String, required: true, unique: true }, // e.g., 'Class 8', 'Class 9', 'Class 10'
  testFee: { type: Number, required: true, default: 1100 },
  passingMarks: { type: Number, default: 40 },
  totalMarks: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('ExamConfig', examConfigSchema);