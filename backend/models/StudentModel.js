const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  studentClass: { type: String, required: true }, // e.g. 'Class 9'
  pincode: { type: String, required: true, maxLength: 6 },
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, default: 'Maharashtra' },
  role: { type: String, default: 'student' },
  is_paid: { type: Boolean, default: false }, // False for free exploration, true after fee payment
  paymentId: { type: String, default: null },
  branchCode: { type: String, default: 'ONLINE-01' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);