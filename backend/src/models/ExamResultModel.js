const mongoose = require('mongoose');

const examResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  examDay: { type: Number, required: true }, // e.g. Day 45
  totalScore: { type: Number, required: true },
  totalQuestions: { type: Number, default: 60 },
  accuracy: { type: String, required: true },
  tabSwitchCount: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ExamResult', examResultSchema);