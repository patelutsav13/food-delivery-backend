const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to Database
mongoose.connect('mongodb://127.0.0.1:27017/AdminBackDb')
  .then(() => console.log('MongoDB Connected for Seeding'))
  .catch(err => console.log(err));

const users = [
  // 1. The Admin (Use this to Login)
  { 
    name: 'Utsav Patel', 
    email: 'utsavadm@gmail.com', 
    password: 'admin_utsav', 
    role: 'Admin', 
    status: 'Active' 
  },


];

const seedDB = async () => {
  try {
    // Remove existing users first
    await User.deleteMany({});
    // Insert new users
    await User.insertMany(users);
    console.log("✅ Database Updated Successfully! ✅");
    console.log("✅ Admin Login: admin@gmail.com / 123 ✅");
  } catch (err) {
    console.log("Seeding Error:", err);
  } finally {
    // Close connection
    mongoose.connection.close();
  }
};

seedDB();