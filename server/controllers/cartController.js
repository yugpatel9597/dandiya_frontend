const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get cart items
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('cartItems.product', 'name price discountPrice images stock category');
    res.json({ success: true, data: user.cartItems });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (product.stock < quantity) {
        res.status(400);
        throw new Error('Insufficient stock');
    }

    const user = await User.findById(req.user._id);
    const existingItem = user.cartItems.find(
        (item) => item.product.toString() === productId
    );

    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price = product.discountPrice > 0 ? product.discountPrice : product.price;
    } else {
        user.cartItems.push({
            product: productId,
            quantity,
            price: product.discountPrice > 0 ? product.discountPrice : product.price,
        });
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cartItems.product', 'name price discountPrice images stock category');
    res.json({ success: true, data: updatedUser.cartItems });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);

    const item = user.cartItems.find(
        (i) => i.product.toString() === req.params.productId
    );

    if (!item) {
        res.status(404);
        throw new Error('Item not found in cart');
    }

    if (quantity <= 0) {
        user.cartItems = user.cartItems.filter(
            (i) => i.product.toString() !== req.params.productId
        );
    } else {
        item.quantity = quantity;
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cartItems.product', 'name price discountPrice images stock category');
    res.json({ success: true, data: updatedUser.cartItems });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.cartItems = user.cartItems.filter(
        (i) => i.product.toString() !== req.params.productId
    );
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('cartItems.product', 'name price discountPrice images stock category');
    res.json({ success: true, data: updatedUser.cartItems });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { cartItems: [] });
    res.json({ success: true, message: 'Cart cleared' });
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
