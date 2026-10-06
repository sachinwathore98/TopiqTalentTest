const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  admissionId: { type: String, required: true, unique: true },
  // Student Details
  studentName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  studentClass: { type: String, required: true },
  school: { type: String },
  parentDetails: { type: String },
  address: { type: String },
  // Exam Details
  examName: { type: String, required: true, default: 'TOPIQ Talent Test' },
  examCategory: { type: String },
  examYear: { type: String, default: '2026' },
  examDate: { type: Date },
  // Hierarchy
  franchiseId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  asmId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Financials
  admissionAmount: { type: Number, required: true, default: 1000 },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid', 'Refunded'], default: 'Paid' },
  paymentId: { type: String },
  paymentDate: { type: Date, default: Date.now },
  franchiseCommission: { type: Number }, // 15%
  asmCommission: { type: Number },       // 5%
  coordinatorCommission: { type: Number }, // 20%
  topiqShare: { type: Number },           // 60%
  // Statuses
  admissionStatus: { type: String, enum: ['Confirmed', 'Pending', 'Cancelled'], default: 'Confirmed' },
  refundStatus: { type: String, default: 'None' },
  settlementStatus: { type: String, enum: ['Settled', 'Pending'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);