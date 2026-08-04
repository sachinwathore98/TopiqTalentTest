const mongoose = require('mongoose');

const franchiseSchema = new mongoose.Schema({
  owner_name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  pincode: { type: String, required: true, maxLength: 6 },
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, default: 'Maharashtra' },
  current_business: { type: String, default: '' },
  investment_capacity: { type: String, required: true },
  preferred_location: { type: String, required: true },
  requirements: { type: String, default: '' },
  branchCodeAssigned: { type: String, default: 'CSN-PENDING' },
  status: { type: String, default: 'Pending Review' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FranchiseEnquiry', franchiseSchema);