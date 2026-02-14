const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  foods: [{
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food'
    },
    name: String,
    quantity: Number,
    price: Number
  }],
  totalPrice: {
    type: Number,
    required: true
  },
  orderTime: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Order', OrderSchema);