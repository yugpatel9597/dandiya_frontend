const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser, getMonthlyReport } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/reports/monthly', protect, admin, getMonthlyReport);

module.exports = router;
