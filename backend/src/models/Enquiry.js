const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String },
  district: { type: String },
  pincode: { type: String },
  state: { type: String, default: 'Maharashtra' },
  message: { type: String },
  enquiryType: { 
    type: String, 
    required: true, 
    lowercase: true,
    enum: ['student', 'franchise', 'agent', 'general'], 
    default: 'student' 
  },
  status: { type: String, default: 'Pending' },
  adminRemarks: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Enquiry', enquirySchema);