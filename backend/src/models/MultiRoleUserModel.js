const mongoose = require('mongoose');

const multiRoleUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['super_admin', 'admin', 'franchise_owner', 'teacher', 'student'], 
    required: true 
  },
  franchiseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Franchise', 
    required: function() { return this.role === 'franchise_owner' || this.role === 'student'; } 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MultiRoleUser', 
    default: null 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MultiRoleUser', multiRoleUserSchema);