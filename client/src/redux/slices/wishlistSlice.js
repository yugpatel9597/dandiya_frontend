import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/wishlist');
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addToWishlist = createAsyncThunk('wishlist/add', async (productId, { rejectWithValue }) => {
    try {
        const res = await api.post(`/wishlist/${productId}`);
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const removeFromWishlist = createAsyncThunk('wishlist/remove', async (productId, { rejectWithValue }) => {
    try {
        const res = await api.delete(`/wishlist/${productId}`);
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: { items: [], loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWishlist.fulfilled, (state, action) => { state.items = action.payload; })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
                toast.success('Added to wishlist! ❤️');
            })
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.items = action.payload;
                toast.success('Removed from wishlist');
            });
    },
});

export default wishlistSlice.reducer;
