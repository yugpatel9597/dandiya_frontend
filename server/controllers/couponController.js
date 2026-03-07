const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// @desc    Validate / apply a coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
    const { code, cartTotal, totalQuantity, userId } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
        res.status(404);
        throw new Error('Invalid coupon code');
    }

    if (!coupon.isActive) {
        res.status(400);
        throw new Error('This coupon is no longer active');
    }

    if (new Date() > coupon.expiryDate) {
        res.status(400);
        throw new Error('This coupon has expired');
    }

    if (coupon.usedCount >= coupon.usageLimit) {
        res.status(400);
        throw new Error('This coupon usage limit has been reached');
    }

    if (coupon.usedBy.includes(userId)) {
        res.status(400);
        throw new Error('You have already used this coupon');
    }

    if (cartTotal < coupon.minPurchaseAmount) {
        res.status(400);
        throw new Error(
            `Minimum purchase amount of ₹${coupon.minPurchaseAmount} is required for this coupon`
        );
    }

    const discountAmount = (cartTotal * coupon.discountPercentage) / 100;
    const finalTotal = cartTotal - discountAmount;

    res.json({
        success: true,
        data: {
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
            discountAmount: discountAmount.toFixed(2),
            finalTotal: finalTotal.toFixed(2),
        },
    });
});

// @desc    Auto-check bulk discount (quantity >= 10)
// @route   POST /api/coupons/auto-check
// @access  Private
const autoCheckCoupon = asyncHandler(async (req, res) => {
    const { totalQuantity, cartTotal } = req.body;

    if (totalQuantity >= 10) {
        // Look for an active auto-apply coupon
        const autoCoupon = await Coupon.findOne({
            autoApplyOnQuantity: { $lte: totalQuantity },
            isActive: true,
            expiryDate: { $gt: new Date() },
        }).sort({ discountPercentage: -1 });

        if (autoCoupon) {
            const discountAmount = (cartTotal * autoCoupon.discountPercentage) / 100;
            return res.json({
                success: true,
                autoApplied: true,
                data: {
                    code: autoCoupon.code,
                    discountPercentage: autoCoupon.discountPercentage,
                    discountAmount: discountAmount.toFixed(2),
                    finalTotal: (cartTotal - discountAmount).toFixed(2),
                    message: `🎉 Auto-discount of ${autoCoupon.discountPercentage}% applied for bulk purchase!`,
                },
            });
        }

        // Fallback: 15% discount for 10+ items
        const discountPercentage = 15;
        const discountAmount = (cartTotal * discountPercentage) / 100;
        return res.json({
            success: true,
            autoApplied: true,
            data: {
                code: 'DANDIYA10',
                discountPercentage,
                discountAmount: discountAmount.toFixed(2),
                finalTotal: (cartTotal - discountAmount).toFixed(2),
                message: '🎉 Auto-discount of 15% applied for purchasing 10+ items!',
            },
        });
    }

    res.json({ success: true, autoApplied: false });
});

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, data: coupons });
});

// @desc    Create coupon (admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
    const { code, discountPercentage, minPurchaseAmount, expiryDate, usageLimit, autoApplyOnQuantity, description } = req.body;

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
        res.status(400);
        throw new Error('Coupon code already exists');
    }

    const coupon = await Coupon.create({
        code,
        discountPercentage,
        minPurchaseAmount: minPurchaseAmount || 0,
        expiryDate,
        usageLimit: usageLimit || 100,
        autoApplyOnQuantity: autoApplyOnQuantity || null,
        description: description || '',
    });

    res.status(201).json({ success: true, data: coupon });
});

// @desc    Update coupon (admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found');
    }

    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
});

// @desc    Delete coupon (admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found');
    }
    await coupon.deleteOne();
    res.json({ success: true, message: 'Coupon deleted' });
});

module.exports = { validateCoupon, autoCheckCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon };
