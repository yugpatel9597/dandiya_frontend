const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
});

const shippingAddressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        orderItems: [orderItemSchema],
        shippingAddress: shippingAddressSchema,
        paymentMethod: {
            type: String,
            enum: ['Razorpay', 'COD'],
            default: 'COD',
        },
        paymentId: { type: String, default: '' },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        itemsPrice: { type: Number, required: true, default: 0 },
        shippingPrice: { type: Number, default: 0 },
        taxPrice: { type: Number, default: 0 },
        totalPrice: { type: Number, required: true, default: 0 },
        discountApplied: { type: Number, default: 0 },
        couponUsed: { type: String, default: '' },
        orderStatus: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending',
        },
        statusHistory: [
            {
                status: String,
                updatedAt: { type: Date, default: Date.now },
                note: String,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
