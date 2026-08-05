const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MultiRoleUser',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  correctCount: {
    type: Number,
    required: true
  },
  wrongCount: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  franchiseId: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);