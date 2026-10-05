const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  admissionId: { type: String, required: true, unique: true }, // e.g. TOPIQ-ADM-000001
  studentName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  examCategory: { type: String, required: true },
  admissionAmount: { type: Number, required: true },
  
  // Hierarchy Links
  franchiseeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  asmId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  coordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Commission Amounts calculated automatically
  franchiseeCommission: { type: Number, default: 0 },
  asmCommission: { type: Number, default: 0 },
  coordinatorCommission: { type: Number, default: 0 },
  companyShare: { type: Number, default: 0 },

  paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Success', 'Failed'] },
  admissionStatus: { type: String, default: 'Under Review', enum: ['Under Review', 'Approved', 'Completed', 'Cancelled'] },
  refundStatus: { type: String, default: 'None', enum: ['None', 'Processing', 'Refunded'] },
  settlementStatus: { type: String, default: 'Pending', enum: ['Pending', 'Eligible', 'Processing', 'Settled'] },
  
  cancellationReason: { type: String },
  refundAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Admission', admissionSchema);