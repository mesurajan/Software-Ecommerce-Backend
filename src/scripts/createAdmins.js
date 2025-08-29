const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // using bcrypt instead of bcryptjs
const path = require('path');
const User = require('../models/UserModels');

// ✅ Load .env from project root
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const admins = [
  {
    name: 'Admin One',
    email: 'admin1@gmail.com',
    password: 'Admin@123',
    address: 'NEA HQ',
    phone: '9800001000',
    age: 40,
    citizenship: 'admin-1',
    photo: '',
  },
];

const sellers = [
  {
    name: 'Seller One',
    email: 'seller1@gmail.com',
    password: 'Seller@123',
    address: 'NEA Seller Office 1',
    phone: '9800003000',
    age: 28,
    citizenship: 'seller-1',
    photo: '',
  },
];

const createUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create Admins
    for (const userData of admins) {
      const exists = await User.findOne({ email: userData.email });
      if (exists) {
        console.log(`❗ Admin already exists: ${userData.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const admin = new User({
        ...userData,
        password: hashedPassword,
        role: 'admin',
      });

      await admin.save();
      console.log(`✅ Admin created: ${admin.email}`);
    }

    // Create Sellers
    for (const userData of sellers) {
      const exists = await User.findOne({ email: userData.email });
      if (exists) {
        console.log(`❗ Seller already exists: ${userData.email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const seller = new User({
        ...userData,
        password: hashedPassword,
        role: 'seller',
      });

      await seller.save();
      console.log(`✅ Seller created: ${seller.email}`);
    }
  } catch (err) {
    console.error('❌ Error creating users:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

createUsers();
