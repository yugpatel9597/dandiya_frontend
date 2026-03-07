const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Coupon code is required'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        discountPercentage: {
            type: Number,
            required: true,
            min: 1,
            max: 100,
        },
        minPurchaseAmount: { type: Number, default: 0 },
        expiryDate: { type: Date, required: true },
        usageLimit: { type: Number, default: 100 },
        usedCount: { type: Number, default: 0 },
        usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        isActive: { type: Boolean, default: true },
        // If set, auto-apply when cart total quantity >= this number
        autoApplyOnQuantity: { type: Number, default: null },
        description: { type: String, default: '' },
    },
    { timestamps: true }
);

// Virtual to check if coupon is expired
couponSchema.virtual('isExpired').get(function () {
    return new Date() > this.expiryDate;
});

// Virtual to check if usage limit reached
couponSchema.virtual('isLimitReached').get(function () {
    return this.usedCount >= this.usageLimit;
});

module.exports = mongoose.model('Coupon', couponSchema);
