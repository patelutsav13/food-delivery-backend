const router = require('express').Router();
const Order = require('../models/Order');

// GET all orders (for AdminPanel)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderTime: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET orders by user email
router.get('/user/:email', async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email }).sort({ orderTime: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new order (from customer checkout)
router.post('/', async (req, res) => {
  try {
    const { username, email, foods, totalPrice } = req.body;

    const newOrder = new Order({
      username,
      email,
      foods,
      totalPrice,
      status: 'pending'
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH update order status (accept/reject)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;