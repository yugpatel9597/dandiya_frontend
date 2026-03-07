import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
    try {
        const query = new URLSearchParams(params).toString();
        const res = await api.get(`/products?${query}`);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
});

export const fetchFeaturedProducts = createAsyncThunk('products/fetchFeatured', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/products/featured');
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});

export const fetchProductById = createAsyncThunk('products/fetchById', async (id, { rejectWithValue }) => {
    try {
        const res = await api.get(`/products/${id}`);
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Product not found');
    }
});

export const fetchRelatedProducts = createAsyncThunk('products/fetchRelated', async (id, { rejectWithValue }) => {
    try {
        const res = await api.get(`/products/${id}/related`);
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message);
    }
});

export const submitReview = createAsyncThunk('products/submitReview', async ({ id, reviewData }, { rejectWithValue }) => {
    try {
        const res = await api.post(`/products/${id}/reviews`, reviewData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to submit review');
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        featured: [],
        selectedProduct: null,
        relatedProducts: [],
        loading: false,
        error: null,
        page: 1,
        pages: 1,
        total: 0,
    },
    reducers: {
        clearSelectedProduct: (state) => { state.selectedProduct = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.data;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
                state.total = action.payload.total;
            })
            .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchFeaturedProducts.pending, (state) => { state.loading = true; })
            .addCase(fetchFeaturedProducts.fulfilled, (state, action) => { state.loading = false; state.featured = action.payload; })
            .addCase(fetchFeaturedProducts.rejected, (state) => { state.loading = false; })
            .addCase(fetchProductById.pending, (state) => { state.loading = true; state.selectedProduct = null; })
            .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.selectedProduct = action.payload; })
            .addCase(fetchProductById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            .addCase(fetchRelatedProducts.fulfilled, (state, action) => { state.relatedProducts = action.payload; })
            .addCase(submitReview.fulfilled, (state) => { state.loading = false; });
    },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
