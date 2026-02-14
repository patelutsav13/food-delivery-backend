require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/AdminBackDb')
  .then(() => console.log('✅ MongoDB Connected ✅'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/foods', require('./routes/foods'));
app.use('/api/users', require('./routes/users'));
app.use('/api/carts', require('./routes/carts'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT} ✅`));