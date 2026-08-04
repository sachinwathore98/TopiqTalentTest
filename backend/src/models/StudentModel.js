const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: true },
  studentClass: { type: String, required: true },
  pincode: { type: String, required: false },
  city: { type: String, required: false },
  district: { type: String, required: true },
  state: { type: String, required: false },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);