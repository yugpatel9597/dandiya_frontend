const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price discountPrice images ratings numReviews stock category');
    res.json({ success: true, data: user.wishlist });
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.productId);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const user = await User.findById(req.user._id);
    const alreadyInWishlist = user.wishlist.some(
        (id) => id.toString() === req.params.productId
    );

    if (!alreadyInWishlist) {
        user.wishlist.push(req.params.productId);
        await user.save();
    }

    const updated = await User.findById(req.user._id).populate('wishlist', 'name price discountPrice images ratings numReviews stock category');
    res.json({ success: true, data: updated.wishlist });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== req.params.productId
    );
    await user.save();

    const updated = await User.findById(req.user._id).populate('wishlist', 'name price discountPrice images ratings numReviews stock category');
    res.json({ success: true, data: updated.wishlist });
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
