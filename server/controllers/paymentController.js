const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Lazily create Razorpay instance so placeholder keys won't crash server startup
const getRazorpay = () => new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body; // amount in paise (INR * 100)

    const options = {
        amount: Math.round(amount * 100), // Convert rupees to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
        success: true,
        data: {
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: razorpayOrder.amount,
            key: process.env.RAZORPAY_KEY_ID,
        },
    });
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
        res.status(400);
        throw new Error('Payment verification failed - invalid signature');
    }

    // Update order as paid
    if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentId = razorpay_payment_id;
            await order.save();
        }
    }

    res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
    });
});

module.exports = { createRazorpayOrder, verifyPayment };
