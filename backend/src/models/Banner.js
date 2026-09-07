const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  targetLink: { type: String },
  position: { type: String, enum: ['hero', 'popup', 'festive_offer', 'sidebar'], default: 'hero' },
  isActive: { type: Boolean, default: true },
  startDate: { type: Date },
  endDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);