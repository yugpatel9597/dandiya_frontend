const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        discountApplied,
        couponUsed,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Mark coupon as used
    if (couponUsed && couponUsed !== 'DANDIYA10') {
        const coupon = await Coupon.findOne({ code: couponUsed });
        if (coupon) {
            coupon.usedCount += 1;
            if (!coupon.usedBy.includes(req.user._id)) {
                coupon.usedBy.push(req.user._id);
            }
            await coupon.save();
        }
    }

    const order = await Order.create({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'COD',
        itemsPrice,
        shippingPrice: shippingPrice || 0,
        taxPrice: taxPrice || 0,
        totalPrice,
        discountApplied: discountApplied || 0,
        couponUsed: couponUsed || '',
        statusHistory: [{ status: 'Pending', note: 'Order placed' }],
    });

    // Clear cart after order
    await User.findByIdAndUpdate(req.user._id, { cartItems: [] });

    res.status(201).json({ success: true, data: order });
});

// @desc    Get user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate('orderItems.product', 'name images');

    res.json({ success: true, data: orders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('orderItems.product', 'name images');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    // Ensure user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to view this order');
    }

    res.json({ success: true, data: order });
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentId = req.body.paymentId || '';

    const updated = await order.save();
    res.json({ success: true, data: updated });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const statusFilter = req.query.status ? { orderStatus: req.query.status } : {};
    const count = await Order.countDocuments(statusFilter);

    const orders = await Order.find(statusFilter)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        success: true,
        data: orders,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
    });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.orderStatus = status;
    order.statusHistory.push({ status, updatedAt: new Date(), note: note || '' });

    if (status === 'Delivered') {
        order.isPaid = true;
        order.paidAt = new Date();
    }

    const updated = await order.save();
    res.json({ success: true, data: updated });
});

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    getAllOrders,
    updateOrderStatus,
};
