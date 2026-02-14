const router = require('express').Router();
const Cart = require('../models/Cart');

// GET user's cart
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            return res.json({ items: [] });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST/PUT - Save or update user's cart
router.post('/:userId', async (req, res) => {
    try {
        const { items } = req.body;

        // Find existing cart or create new one
        let cart = await Cart.findOne({ userId: req.params.userId });

        if (cart) {
            // Update existing cart
            cart.items = items;
            cart.updatedAt = Date.now();
            await cart.save();
        } else {
            // Create new cart
            cart = new Cart({
                userId: req.params.userId,
                items: items
            });
            await cart.save();
        }

        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Clear user's cart
router.delete('/:userId', async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.params.userId });
        res.json({ msg: "Cart cleared" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
