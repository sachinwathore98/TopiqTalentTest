const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Define a simple User schema matching your multiroleusers collection
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  franchiseId: { type: mongoose.Schema.Types.ObjectId, default: null }
});

const User = mongoose.model('User', userSchema, 'multiroleusers');

const seedSuperAdmin = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas for seeding...');

    const email = 'topiqtalenttest@gmail.com';
    const plainPassword = 'Admin@123';
    
    // Hash the password using bcrypt (10 rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Check if super admin already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Update existing user with the correct bcrypt hash
      existingUser.password = hashedPassword;
      existingUser.role = 'super_admin';
      existingUser.name = 'Super Admin';
      await existingUser.save();
      console.log('Super Admin user updated successfully with a fresh bcrypt hash!');
    } else {
      // Create new super admin user
      const newAdmin = new User({
        name: 'Super Admin',
        email: email,
        password: hashedPassword,
        role: 'super_admin',
        franchiseId: null
      });
      await newAdmin.save();
      console.log('Super Admin user created successfully with a hashed password!');
    }

    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
    mongoose.connection.close();
  }
};

seedSuperAdmin();