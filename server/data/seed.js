const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
};

const products = [
    {
        name: 'Classic Wooden Dandiya Sticks',
        description: 'Traditional handcrafted wooden dandiya sticks, perfect for Navratri celebrations. Smooth finish with natural wood texture. Ideal for all age groups.',
        price: 299,
        discountPrice: 249,
        category: 'Garba Dandiya',
        brand: 'DandiyaKart',
        stock: 150,
        ratings: 4.5,
        numReviews: 22,
        images: ['/uploads/product-placeholder.jpg'],
        isFeatured: true,
        tags: ['wooden', 'classic', 'navratri', 'traditional'],
    },
    {
        name: 'Multicolor LED Dandiya Sticks',
        description: 'Stunning LED dandiya sticks that light up in multiple colors. Battery-powered with 3 lighting modes. Perfect for creating a magical atmosphere.',
        price: 599,
        discountPrice: 499,
        category: 'LED Dandiya',
        brand: 'DandiyaKart',
        stock: 80,
        ratings: 4.8,
        numReviews: 35,
        images: ['/uploads/product-placeholder.jpg'],
        isFeatured: true,
        tags: ['LED', 'multicolor', 'light-up', 'premium'],
    },
    {
        name: 'Designer Meenakari Dandiya Sticks',
        description: 'Exquisitely crafted dandiya sticks with Meenakari artwork. Hand-painted with vibrant colors and mirror work. A perfect blend of tradition and art.',
        price: 799,
        discountPrice: 699,
        category: 'Designer Dandiya',
        brand: 'DandiyaKart',
        stock: 60,
        ratings: 4.9,
        numReviews: 28,
        images: ['/uploads/product-placeholder.jpg'],
        isFeatured: true,
        tags: ['designer', 'meenakari', 'handcrafted', 'art'],
    },
    {
        name: 'Kids Soft Dandiya Sticks',
        description: 'Safe and soft dandiya sticks specially designed for children. Made with foam coating to prevent injury. Bright and colorful for kids to enjoy.',
        price: 199,
        discountPrice: 149,
        category: 'Kids Dandiya',
        brand: 'DandiyaKart',
        stock: 200,
        ratings: 4.6,
        numReviews: 41,
        images: ['/uploads/product-placeholder.jpg'],
        isFeatured: false,
        tags: ['kids', 'safe', 'soft', 'colorful', 'children'],
    },
    {
        name: 'Navratri Combo Pack - 5 Pairs',
        description: 'Get 5 pairs of assorted dandiya sticks including 2 classic wooden, 2 LED and 1 designer pair. Perfect for group performances and family celebrations.',
        price: 1499,
        discountPrice: 1199,
        category: 'Combo Packs',
        brand: 'DandiyaKart',
        stock: 40,
        ratings: 4.7,
        numReviews: 19,
        images: ['/uploads/product-placeholder.jpg'],
        isFeatured: true,
        tags: ['combo', '5-pairs', 'value', 'group'],
    },
    {
        name: 'RGB Glow LED Dandiya - Premium',
        description: 'Premium RGB LED dandiya sticks with Bluetooth control. Change colors via smartphone app. Rechargeable via USB. The ultimate festive accessory.',
        price: 1299,
        discountPrice: 999,
        category: 'LED Dandiya',
        brand: 'DandiyaKart',
        stock: 35,
        ratings: 4.9,
        numReviews: 55,
        images: ['/uploads/product-placeholder.jpg'],
        isFeatured: true,
        tags: ['RGB', 'bluetooth', 'premium', 'USB', 'rechargeable'],
    },
    {
        name: 'Embroidered Fabric Dandiya Sticks',
        description: 'Unique dandiya sticks wrapped in silk fabric with hand-embroidered patterns. Lightweight and beautiful. Perfect as gifts or keepsakes.',
        price: 649,
        discountPrice: 549,
        category: 'Designer Dandiya',
        brand: 'DandiyaKart',
        stock: 75,
        ratings: 4.4,
        numReviews: 15,
        images: ['/uploads/product-placeholder.jpg'],
        isFeatured: false,
        tags: ['embroidered', 'silk', 'fabric', 'gift'],
    },
    {
        name: 'Mini Kids LED Dandiya Set',
        description: 'Mini-sized LED dandiya sticks perfect for little hands. Safe battery compartment. Comes in a set of 2 pairs. Ages 3 and above.',
        price: 299,
        discountPrice: 249,
        category: 'Kids Dandiya',
        brand: 'DandiyaKart',
        stock: 120,
        ratings: 4.5,
        numReviews: 33,
        images: ['/uploads/product-placeholder.jpg'],
        isFeatured: false,
        tags: ['kids', 'LED', 'mini', 'set'],
    },
    {
        name: 'Family Celebration Combo - 10 Pairs',
        description: 'The ultimate family pack with 10 pairs of assorted dandiya sticks. Includes wooden, LED, and designer varieties for the whole family.',
        price: 2499,
        discountPrice: 1999,
        category: 'Combo Packs',
        brand: 'DandiyaKart',
        stock: 25,
        ratings: 4.8,
        numReviews: 12,
        images: ['/uploads/product-placeholder.jpg'],
        isFeatured: true,
        tags: ['family', '10-pairs', 'combo', 'celebration'],
    },
    {
        name: 'Gold Plated Designer Dandiya',
        description: 'Luxurious gold-plated dandiya sticks adorned with gemstones and intricate engravings. Perfect for premium celebrations and as collector items.',
        price: 1899,
        discountPrice: 1599,
        category: 'Designer Dandiya',
        brand: 'DandiyaKart',
        stock: 20,
        ratings: 5.0,
        numReviews: 8,
        images: ['/uploads/product-placeholder.jpg'],
        isFeatured: false,
        tags: ['gold', 'luxury', 'designer', 'gemstone'],
    },
    {
        name: 'Bamboo Eco Dandiya Sticks',
        description: 'Eco-friendly dandiya sticks made from sustainable bamboo. Light, durable, and natural. Good grip design for comfort during dance.',
        price: 349,
        discountPrice: 299,
        category: 'Garba Dandiya',
        brand: 'DandiyaKart',
        stock: 180,
        ratings: 4.3,
        numReviews: 18,
        images: ['/uploads/product-placeholder.jpg'],
        isFeatured: false,
        tags: ['bamboo', 'eco', 'sustainable', 'natural'],
    },
    {
        name: 'Navratri Starter Kit - 2 Pairs',
        description: 'Complete starter kit for beginners. Includes 1 wooden pair and 1 LED pair. Comes with a traditional pouch for storage.',
        price: 499,
        discountPrice: 399,
        category: 'Combo Packs',
        brand: 'DandiyaKart',
        stock: 90,
        ratings: 4.6,
        numReviews: 26,
        images: ['/uploads/product-placeholder.jpg'],
        isFeatured: false,
        tags: ['starter', 'beginner', '2-pairs', 'value'],
    },
];

const coupons = [
    {
        code: 'DANDIYA10',
        discountPercentage: 15,
        minPurchaseAmount: 0,
        expiryDate: new Date('2027-12-31'),
        usageLimit: 10000,
        autoApplyOnQuantity: 10,
        description: 'Automatic 15% discount for purchasing 10 or more dandiya sticks',
        isActive: true,
    },
    {
        code: 'NAVRATRI25',
        discountPercentage: 25,
        minPurchaseAmount: 999,
        expiryDate: new Date('2027-12-31'),
        usageLimit: 500,
        description: 'Navratri special 25% off on orders above ₹999',
        isActive: true,
    },
    {
        code: 'WELCOME10',
        discountPercentage: 10,
        minPurchaseAmount: 499,
        expiryDate: new Date('2027-12-31'),
        usageLimit: 1000,
        description: 'Welcome discount for new customers - 10% off',
        isActive: true,
    },
    {
        code: 'GARBA20',
        discountPercentage: 20,
        minPurchaseAmount: 1499,
        expiryDate: new Date('2027-12-31'),
        usageLimit: 200,
        description: '20% off on premium purchases above ₹1499',
        isActive: true,
    },
];

const seedData = async () => {
    try {
        await connectDB();

        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Product.deleteMany({});
        await Coupon.deleteMany({});
        await Order.deleteMany({});

        // Create admin user
        console.log('👤 Creating admin user...');
        const adminUser = await User.create({
            name: 'DandiyaKart Admin',
            email: 'admin@dandiyakart.com',
            password: 'admin123456',
            role: 'admin',
        });

        // Create test user
        const testUser = await User.create({
            name: 'Test User',
            email: 'user@dandiyakart.com',
            password: 'user123456',
            role: 'user',
        });

        console.log('📦 Creating products...');
        await Product.insertMany(products);

        console.log('🎟️  Creating coupons...');
        await Coupon.insertMany(coupons);

        console.log('\n✅ Database seeded successfully!\n');
        console.log('🔑 Admin Credentials:');
        console.log('   Email: admin@dandiyakart.com');
        console.log('   Password: admin123456\n');
        console.log('👤 Test User Credentials:');
        console.log('   Email: user@dandiyakart.com');
        console.log('   Password: user123456\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedData();
