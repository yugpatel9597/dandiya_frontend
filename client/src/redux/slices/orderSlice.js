import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
    try {
        const res = await api.post('/orders', orderData);
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to create order'); }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/orders/myorders');
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { rejectWithValue }) => {
    try {
        const res = await api.get(`/orders/${id}`);
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const markOrderPaid = createAsyncThunk('orders/markPaid', async ({ id, paymentId }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/orders/${id}/pay`, { paymentId });
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

// Admin
export const fetchAllOrders = createAsyncThunk('orders/fetchAll', async (params, { rejectWithValue }) => {
    try {
        const query = new URLSearchParams(params).toString();
        const res = await api.get(`/orders?${query}`);
        return res.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status, note }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/orders/${id}/status`, { status, note });
        return res.data.data;
    } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        myOrders: [], allOrders: [], selectedOrder: null,
        loading: false, error: null, page: 1, pages: 1, total: 0,
    },
    reducers: {
        clearSelectedOrder: (state) => { state.selectedOrder = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => { state.loading = true; })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false; state.selectedOrder = action.payload;
                toast.success('Order placed successfully! 🎉');
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false; toast.error(action.payload);
            })
            .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
            .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.myOrders = action.payload; })
            .addCase(fetchMyOrders.rejected, (state) => { state.loading = false; })
            .addCase(fetchOrderById.pending, (state) => { state.loading = true; })
            .addCase(fetchOrderById.fulfilled, (state, action) => { state.loading = false; state.selectedOrder = action.payload; })
            .addCase(fetchOrderById.rejected, (state) => { state.loading = false; })
            .addCase(fetchAllOrders.pending, (state) => { state.loading = true; })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false; state.allOrders = action.payload.data;
                state.page = action.payload.page; state.pages = action.payload.pages; state.total = action.payload.total;
            })
            .addCase(fetchAllOrders.rejected, (state) => { state.loading = false; })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.allOrders = state.allOrders.map(o => o._id === action.payload._id ? action.payload : o);
                toast.success('Order status updated!');
            });
    },
});

export const { clearSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
