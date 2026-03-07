# 🎋 DandiyaKart - Premium Dandiya E-commerce Store

A full-stack MERN e-commerce application for selling Dandiya/Garba products for Navratri celebrations.

## 🚀 Tech Stack

- **Frontend**: React.js (Vite), Redux Toolkit, React Router DOM, Tailwind CSS, Recharts, React Icons
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt, Multer
- **Payment**: Razorpay (test mode)

---

## 📁 Project Structure

```
E-commerce/
├── client/          # React frontend
│   └── src/
│       ├── pages/          # All pages (Home, Products, Cart, Checkout, Admin...)
│       ├── components/     # Reusable components
│       ├── redux/          # Redux Toolkit slices & store
│       └── services/       # Axios API service
└── server/          # Node.js backend
    ├── controllers/        # Business logic
    ├── models/             # Mongoose schemas
    ├── routes/             # Express routes
    ├── middleware/         # Auth, error, upload
    └── data/               # Seed data
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Razorpay test account (optional)

### 1. Clone & Setup Server

```bash
cd server
npm install
```

Copy `.env.example` to `.env` and fill in your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/dandiyakart
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxx
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 2. Seed the Database

```bash
cd server
npm run seed
```

**Admin credentials (after seed):**
- Email: `admin@dandiyakart.com`
- Password: `admin123456`

**Test user:**
- Email: `user@dandiyakart.com`
- Password: `user123456`

### 3. Start the Server

```bash
cd server
npm run dev
```

Server runs on: `http://localhost:5000`

### 4. Setup Client

```bash
cd client
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 📚 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/profile` | User | Get profile |
| PUT | `/api/auth/profile` | User | Update profile |
| GET | `/api/products` | Public | List products (search, filter, paginate) |
| GET | `/api/products/featured` | Public | Featured products |
| GET | `/api/products/:id` | Public | Product detail |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/products/:id/reviews` | User | Add review |
| GET | `/api/cart` | User | Get cart |
| POST | `/api/cart` | User | Add to cart |
| PUT | `/api/cart/:productId` | User | Update quantity |
| DELETE | `/api/cart/:productId` | User | Remove item |
| GET | `/api/wishlist` | User | Get wishlist |
| POST | `/api/wishlist/:productId` | User | Add to wishlist |
| POST | `/api/orders` | User | Place order |
| GET | `/api/orders/myorders` | User | My orders |
| GET | `/api/orders/:id` | User | Order detail |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/:id/status` | Admin | Update status |
| POST | `/api/coupons/validate` | User | Validate coupon |
| POST | `/api/coupons/auto-check` | User | Check bulk discount |
| GET | `/api/coupons` | Admin | All coupons |
| POST | `/api/coupons` | Admin | Create coupon |
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/users` | Admin | All users |
| GET | `/api/admin/reports/monthly` | Admin | Monthly report |
| POST | `/api/payment/create-order` | User | Init Razorpay |
| POST | `/api/payment/verify` | User | Verify payment |

---

## 🎟️ Coupon System

### Special Bulk Discount Logic
When a customer's cart has **10 or more items**, a **15% discount** is automatically applied using coupon code `DANDIYA10`.

**Built-in coupon codes:**
- `DANDIYA10` - 15% off for 10+ items (auto-applied)
- `NAVRATRI25` - 25% off on orders ₹999+
- `WELCOME10` - 10% off on orders ₹499+
- `GARBA20` - 20% off on orders ₹1499+

---

## 🎨 Features

### User Features
- JWT-based registration & login
- Browse, search, filter, sort products
- Add to cart / wishlist
- Coupon codes & bulk auto-discount
- Multi-step checkout with Razorpay / COD
- Order history & tracking timeline
- Product reviews & ratings
- Profile & address management

### Admin Features
- Dashboard with stats + sales chart
- Product CRUD with image uploads
- Order management & status updates
- User management
- Coupon CRUD with auto-apply qty config
- Monthly sales reports (bar chart + table)

---

## 🔐 Environment Variables

See `server/.env.example` for full list.

---

## 🌟 Default Theme

The app uses a festive **orange/gold/maroon** color palette matching the Dandiya/Navratri aesthetic, with dark mode design, glassmorphism effects, and smooth animations.
