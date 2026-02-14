const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        id: String,
        title: String,
        price: Number,
        image: String,
        category: String,
        quantity: Number
    }],
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
CartSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Cart', CartSchema);
