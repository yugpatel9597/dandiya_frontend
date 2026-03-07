const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueResult = await Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const recentOrders = await Order.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);

    // Monthly sales for current year
    const currentYear = new Date().getFullYear();
    const monthlySales = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: new Date(`${currentYear}-01-01`), $lte: new Date(`${currentYear}-12-31`) },
                orderStatus: { $ne: 'Cancelled' },
            },
        },
        {
            $group: {
                _id: { $month: '$createdAt' },
                revenue: { $sum: '$totalPrice' },
                orders: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    // Fill missing months with 0
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const salesData = months.map((month, i) => {
        const found = monthlySales.find((s) => s._id === i + 1);
        return { month, revenue: found?.revenue || 0, orders: found?.orders || 0 };
    });

    // Order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    res.json({
        success: true,
        data: {
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            recentOrders,
            salesData,
            orderStatusBreakdown,
        },
    });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const count = await User.countDocuments();
    const users = await User.find()
        .select('-password -cartItems')
        .sort({ createdAt: -1 })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ success: true, data: users, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }
    if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete admin user');
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
});

// @desc    Get monthly sales report (admin)
// @route   GET /api/admin/reports/monthly
// @access  Private/Admin
const getMonthlyReport = asyncHandler(async (req, res) => {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const monthlySales = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) },
                orderStatus: { $ne: 'Cancelled' },
            },
        },
        {
            $group: {
                _id: { $month: '$createdAt' },
                revenue: { $sum: '$totalPrice' },
                orders: { $sum: 1 },
                discount: { $sum: '$discountApplied' },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const report = months.map((month, i) => {
        const found = monthlySales.find((s) => s._id === i + 1);
        return {
            month,
            revenue: found?.revenue || 0,
            orders: found?.orders || 0,
            discount: found?.discount || 0,
        };
    });

    res.json({ success: true, data: report, year });
});

module.exports = { getDashboardStats, getAllUsers, deleteUser, getMonthlyReport };
