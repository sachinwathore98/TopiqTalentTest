const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  enquiryType: { type: String, enum: ['Franchise', 'Agent', 'Student Admission', 'General'], required: true },
  city: { type: String },
  message: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Denied', 'Follow-up Required'], default: 'Pending' },
  adminRemarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);