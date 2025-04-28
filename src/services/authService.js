import api from './api';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import store from '../store';

const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/token/', {
                username: credentials.username,
                password: credentials.password
            });
            return response.data;
        } catch (error) {
            if (error.response?.data) {
                throw new Error(error.response.data.detail || 'Invalid credentials');
            }
            throw error;
        }
    },

    refreshToken: async (refresh) => {
        const response = await api.post('/token/refresh/', { refresh });
        console.log(response.data);
        return response.data;
    },

    async logout() {
        try {
            const refreshToken = store.getState().auth.refreshToken;
            if (refreshToken) {
                await api.post('/token/blacklist/', { refresh: refreshToken });
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            store.dispatch(logout());
        }
    },

    async checkAuthStatus() {
        const token = store.getState().auth.token;
        if (!token) return false;

        try {
            await api.get('/users/me/');
            return true;
        } catch (error) {
            return false;
        }
    },

    // Password reset methods
    requestPasswordReset: async (email) => {
        try {
            const response = await api.post('/password-reset/request/', { email });
            return response.data;
        } catch (error) {
            console.error('Error requesting password reset:', error);
            throw error;
        }
    },

    verifyOTP: async (email, otp) => {
        try {
            const response = await api.post('/password-reset/verify-otp/', { email, otp });
            return response.data;
        } catch (error) {
            console.error('Error verifying OTP:', error);
            throw error;
        }
    },

    resetPassword: async (email, otp, new_password) => {
        try {
            const response = await api.post('/password-reset/reset/', {
                email,
                otp,
                new_password
            });
            return response.data;
        } catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    }
};

export default authService; 