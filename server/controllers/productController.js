const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products with search, filter, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = parseInt(req.query.pageSize) || 12;
    const page = parseInt(req.query.page) || 1;

    const keyword = req.query.keyword
        ? {
            $or: [
                { name: { $regex: req.query.keyword, $options: 'i' } },
                { description: { $regex: req.query.keyword, $options: 'i' } },
            ],
        }
        : {};

    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    const priceFilter =
        req.query.minPrice || req.query.maxPrice
            ? {
                price: {
                    ...(req.query.minPrice && { $gte: parseFloat(req.query.minPrice) }),
                    ...(req.query.maxPrice && { $lte: parseFloat(req.query.maxPrice) }),
                },
            }
            : {};

    const ratingFilter = req.query.rating ? { ratings: { $gte: parseFloat(req.query.rating) } } : {};

    const filter = { ...keyword, ...categoryFilter, ...priceFilter, ...ratingFilter };

    // Sorting
    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sortOption = { price: 1 };
    else if (req.query.sort === 'price-desc') sortOption = { price: -1 };
    else if (req.query.sort === 'rating') sortOption = { ratings: -1 };
    else if (req.query.sort === 'newest') sortOption = { createdAt: -1 };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .sort(sortOption)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        success: true,
        data: products,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
    });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isFeatured: true }).limit(8);
    res.json({ success: true, data: products });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.json({ success: true, data: product });
});

// @desc    Get related products (same category)
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    const related = await Product.find({
        category: product.category,
        _id: { $ne: product._id },
    }).limit(4);
    res.json({ success: true, data: related });
});

// @desc    Create a product (admin)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    const { name, description, price, discountPrice, category, brand, stock, isFeatured, tags } =
        req.body;

    const images = req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [];

    const product = await Product.create({
        name,
        description,
        price,
        discountPrice: discountPrice || 0,
        category,
        brand: brand || 'DandiyaKart',
        stock,
        isFeatured: isFeatured === 'true' || isFeatured === true,
        images,
        tags: tags ? tags.split(',').map((t) => t.trim()) : [],
    });

    res.status(201).json({ success: true, data: product });
});

// @desc    Update a product (admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const { name, description, price, discountPrice, category, brand, stock, isFeatured, tags } =
        req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.discountPrice = discountPrice !== undefined ? discountPrice : product.discountPrice;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.stock = stock !== undefined ? stock : product.stock;
    product.isFeatured = isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : product.isFeatured;
    product.tags = tags ? tags.split(',').map((t) => t.trim()) : product.tags;

    if (req.files && req.files.length > 0) {
        const newImages = req.files.map((f) => `/uploads/${f.filename}`);
        product.images = [...product.images, ...newImages];
    }

    const updated = await product.save();
    res.json({ success: true, data: updated });
});

// @desc    Delete a product (admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    await product.deleteOne();
    res.json({ success: true, message: 'Product removed' });
});

// @desc    Add review to product
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
        res.status(400);
        throw new Error('You have already reviewed this product');
    }

    const review = { user: req.user._id, name: req.user.name, rating: Number(rating), comment };
    product.reviews.push(review);
    product.updateRatings();
    await product.save();

    res.status(201).json({ success: true, message: 'Review added' });
});

module.exports = {
    getProducts,
    getFeaturedProducts,
    getProductById,
    getRelatedProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
};
