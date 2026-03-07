const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Product name is required'], trim: true },
        description: { type: String, required: [true, 'Description is required'] },
        price: { type: Number, required: [true, 'Price is required'], min: 0 },
        discountPrice: { type: Number, default: 0 },
        category: {
            type: String,
            required: true,
            enum: ['Garba Dandiya', 'LED Dandiya', 'Designer Dandiya', 'Kids Dandiya', 'Combo Packs'],
        },
        brand: { type: String, default: 'DandiyaKart' },
        stock: { type: Number, required: true, default: 0 },
        ratings: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        images: [{ type: String }],
        reviews: [reviewSchema],
        isFeatured: { type: Boolean, default: false },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

// Update ratings average when reviews change
productSchema.methods.updateRatings = function () {
    if (this.reviews.length === 0) {
        this.ratings = 0;
        this.numReviews = 0;
    } else {
        this.numReviews = this.reviews.length;
        this.ratings =
            this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    }
};

module.exports = mongoose.model('Product', productSchema);
