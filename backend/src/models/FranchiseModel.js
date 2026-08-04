const mongoose = require('mongoose');

const franchiseSchema = new mongoose.Schema({
  owner_name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  current_business: { type: String },
  investment_capacity: { type: String },
  preferred_location: { type: String, required: true },
  requirements: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Franchise', franchiseSchema);