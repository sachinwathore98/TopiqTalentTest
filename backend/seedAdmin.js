require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function seedSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const hashedPassword = await bcrypt.hash('Topiq@123', 10);
    
    await User.findOneAndUpdate(
      { email: 'topiqtalenttest@gmail.com' },
      {
        name: 'Super Admin',
        email: 'topiqtalenttest@gmail.com',
        password: hashedPassword,
        role: 'super_admin',
        status: 'active'
      },
      { upsert: true, new: true }
    );

    console.log('Super Admin account successfully updated/created: topiqtalenttest@gmail.com');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedSuperAdmin();