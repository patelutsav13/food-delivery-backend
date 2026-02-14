const router = require('express').Router();
const User = require('../models/User');

// Admin Login - Only for Admin Panel
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    // Simple password check
    if (user.password !== password) return res.status(400).json({ msg: "Invalid credentials" });

    // CRITICAL: Only Admin can login
    if (user.role !== 'Admin') {
      return res.status(403).json({ msg: "Access Denied: Only Admins can login here." });
    }

    // Set all users to Inactive
    await User.updateMany({}, { status: 'Inactive' });

    // Set this user to Active and update lastLogin
    user.status = 'Active';
    user.lastLogin = new Date();
    await user.save();

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customer Registration - For Main Website
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide name, email, and password" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Create new customer user
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      role: 'Customer', // Default role for main website users
      status: 'Active'
    });

    await newUser.save();

    res.status(201).json({
      msg: "Registration successful",
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Customer Login - For Main Website
router.post('/customer-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Simple password check
    if (user.password !== password) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Only allow Customer role (opposite of admin login)
    if (user.role !== 'Customer') {
      return res.status(403).json({ msg: "Access Denied: This login is for customers only." });
    }

    // Set all users to Inactive
    await User.updateMany({}, { status: 'Inactive' });

    // Set this user to Active and update lastLogin
    user.status = 'Active';
    user.lastLogin = new Date();
    await user.save();

    res.json({
      msg: "Login successful",
      user: user
    });
  } catch (err) {
    console.error('Customer login error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;