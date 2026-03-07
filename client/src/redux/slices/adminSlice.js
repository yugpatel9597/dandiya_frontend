import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const fetchDashboardStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/admin/stats');
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchAllUsers = createAsyncThunk('admin/fetchUsers', async (params, { rejectWithValue }) => {
    try {
        const query = new URLSearchParams(params).toString();
        const res = await api.get(`/admin/users?${query}`);
        return res.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/admin/users/${id}`);
        return id;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchMonthlyReport = createAsyncThunk('admin/monthlyReport', async (year, { rejectWithValue }) => {
    try {
        const res = await api.get(`/admin/reports/monthly?year=${year}`);
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

// Product admin thunks
export const createProduct = createAsyncThunk('admin/createProduct', async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to create product'); }
});

export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, formData }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update product'); }
});

export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/products/${id}`);
        return id;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

// Coupon admin thunks
export const fetchCoupons = createAsyncThunk('admin/fetchCoupons', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/coupons');
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createCoupon = createAsyncThunk('admin/createCoupon', async (data, { rejectWithValue }) => {
    try {
        const res = await api.post('/coupons', data);
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateCoupon = createAsyncThunk('admin/updateCoupon', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/coupons/${id}`, data);
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteCoupon = createAsyncThunk('admin/deleteCoupon', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/coupons/${id}`);
        return id;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        stats: null, users: [], coupons: [], monthlyReport: [],
        loading: false, error: null, page: 1, pages: 1, total: 0,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => { state.loading = true; })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => { state.loading = false; state.stats = action.payload; })
            .addCase(fetchDashboardStats.rejected, (state) => { state.loading = false; })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.users = action.payload.data;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
                state.total = action.payload.total;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
                toast.success('User deleted');
            })
            .addCase(deleteUser.rejected, (state, action) => { toast.error(action.payload); })
            .addCase(fetchMonthlyReport.fulfilled, (state, action) => { state.monthlyReport = action.payload; })
            .addCase(createProduct.fulfilled, () => { toast.success('Product created! 📦'); })
            .addCase(createProduct.rejected, (state, action) => { toast.error(action.payload); })
            .addCase(updateProduct.fulfilled, () => { toast.success('Product updated!'); })
            .addCase(updateProduct.rejected, (state, action) => { toast.error(action.payload); })
            .addCase(deleteProduct.fulfilled, () => { toast.success('Product deleted'); })
            .addCase(fetchCoupons.fulfilled, (state, action) => { state.coupons = action.payload; })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.coupons.unshift(action.payload); toast.success('Coupon created!');
            })
            .addCase(createCoupon.rejected, (state, action) => { toast.error(action.payload); })
            .addCase(updateCoupon.fulfilled, (state, action) => {
                state.coupons = state.coupons.map(c => c._id === action.payload._id ? action.payload : c);
                toast.success('Coupon updated!');
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.coupons = state.coupons.filter(c => c._id !== action.payload);
                toast.success('Coupon deleted');
            });
    },
});

export default adminSlice.reducer;
