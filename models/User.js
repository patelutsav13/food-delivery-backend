const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Admin', 'Customer'], default: 'Customer' },
  joinDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Inactive' },
  lastLogin: { type: Date }
});
module.exports = mongoose.model('User', UserSchema);