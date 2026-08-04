const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  student_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  class_standard: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  school_name: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);