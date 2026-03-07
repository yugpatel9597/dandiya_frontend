import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Load user from localStorage
const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
const storedToken = localStorage.getItem('token') || null;

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/register', data);
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
});

export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
    try {
        const res = await api.post('/auth/login', data);
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
    try {
        const res = await api.put('/auth/profile', data);
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Profile update failed');
    }
});

export const fetchProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/auth/profile');
        return res.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: storedUser,
        token: storedToken,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            toast.success('Logged out successfully');
        },
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        const handlePending = (state) => { state.loading = true; state.error = null; };
        const handleFulfilled = (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.token = action.payload.token || state.token;
            if (action.payload.token) {
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload));
            }
        };
        const handleRejected = (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error(action.payload);
        };

        builder
            .addCase(registerUser.pending, handlePending)
            .addCase(registerUser.fulfilled, (state, action) => {
                handleFulfilled(state, action);
                toast.success('Account created successfully! 🎉');
            })
            .addCase(registerUser.rejected, handleRejected)
            .addCase(loginUser.pending, handlePending)
            .addCase(loginUser.fulfilled, (state, action) => {
                handleFulfilled(state, action);
                toast.success(`Welcome back, ${action.payload.name}! 🎊`);
            })
            .addCase(loginUser.rejected, handleRejected)
            .addCase(updateProfile.pending, handlePending)
            .addCase(updateProfile.fulfilled, (state, action) => {
                handleFulfilled(state, action);
                toast.success('Profile updated successfully!');
            })
            .addCase(updateProfile.rejected, handleRejected)
            .addCase(fetchProfile.pending, handlePending)
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchProfile.rejected, (state) => { state.loading = false; });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
