const express = require('express');
const router = express.Router();
const {
    getProducts, getFeaturedProducts, getProductById,
    getRelatedProducts, createProduct, updateProduct,
    deleteProduct, createProductReview,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
router.post('/:id/reviews', protect, createProductReview);

// Admin routes
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
