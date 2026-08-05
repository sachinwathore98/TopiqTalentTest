const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOption: { type: Number, required: true }, // Index of the correct option (0-3)
  subject: { type: String, required: true }        // e.g., Physics, Chemistry, Maths
});

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  examType: { type: String, required: true }, // e.g., JEE, NEET, CBSE
  questions: [questionSchema],
  createdAt: { type: Date, default: Date.now }
});

const ResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'MultiRoleUser', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  score: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  wrongCount: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  answersProvided: [{ questionId: String, selectedOption: Number }],
  submittedAt: { type: Date, default: Date.now }
});

const Exam = mongoose.model('Exam', examSchema);
const ExamResult = mongoose.model('ExamResult', ResultSchema);

module.exports = { Exam, ExamResult };