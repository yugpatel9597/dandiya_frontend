import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import orderReducer from './slices/orderSlice';
import couponReducer from './slices/couponSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        cart: cartReducer,
        wishlist: wishlistReducer,
        orders: orderReducer,
        coupon: couponReducer,
        admin: adminReducer,
    },
});

export default store;
