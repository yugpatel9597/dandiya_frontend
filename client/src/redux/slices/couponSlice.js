import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const validateCoupon = createAsyncThunk('coupon/validate', async (data, { rejectWithValue }) => {
    try {
        const res = await api.post('/coupons/validate', data);
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message || 'Invalid coupon'); }
});

export const autoCheckCoupon = createAsyncThunk('coupon/autoCheck', async (data, { rejectWithValue }) => {
    try {
        const res = await api.post('/coupons/auto-check', data);
        return res.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const couponSlice = createSlice({
    name: 'coupon',
    initialState: { applied: null, loading: false, error: null },
    reducers: {
        removeCoupon: (state) => {
            state.applied = null;
            toast.success('Coupon removed');
        },
        clearCouponError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(validateCoupon.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(validateCoupon.fulfilled, (state, action) => {
                state.loading = false; state.applied = action.payload;
                toast.success(`Coupon applied! ${action.payload.discountPercentage}% off 🎉`);
            })
            .addCase(validateCoupon.rejected, (state, action) => {
                state.loading = false; state.error = action.payload;
                toast.error(action.payload || 'Invalid coupon code');
            })
            .addCase(autoCheckCoupon.fulfilled, (state, action) => {
                if (action.payload.autoApplied) {
                    state.applied = action.payload.data;
                    toast.success(action.payload.data.message);
                }
            });
    },
});

export const { removeCoupon, clearCouponError } = couponSlice.actions;
export default couponSlice.reducer;
