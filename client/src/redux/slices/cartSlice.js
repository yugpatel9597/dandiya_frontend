import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/cart');
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const res = await api.post('/cart', { productId, quantity });
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to add to cart'); }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, quantity }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/cart/${productId}`, { quantity });
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (productId, { rejectWithValue }) => {
    try {
        const res = await api.delete(`/cart/${productId}`);
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
    try {
        await api.delete('/cart');
        return [];
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState: { items: [], loading: false, error: null },
    reducers: {
        clearCartLocal: (state) => { state.items = []; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => { state.loading = true; })
            .addCase(fetchCart.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchCart.rejected, (state) => { state.loading = false; })
            .addCase(addToCart.pending, (state) => { state.loading = true; })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false; state.items = action.payload;
                toast.success('Added to cart! 🛒');
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                toast.error(action.payload || 'Failed to add to cart');
            })
            .addCase(updateCartItem.fulfilled, (state, action) => { state.items = action.payload; })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload;
                toast.success('Item removed from cart');
            })
            .addCase(clearCart.fulfilled, (state) => { state.items = []; });
    },
});

export const { clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
