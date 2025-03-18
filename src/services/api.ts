import axios from 'axios';
import { Coupon, LoginCredentials } from '../types';

const api = axios.create({
    baseURL: 'https://backend-gnanganga.onrender.com/api',
    withCredentials: true
});

// Automatically attach token for all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Fetch token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Add it to headers
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token); // Save token
        }
        return response.data;
    },
    logout: async () => {
        localStorage.removeItem('token'); // Clear token on logout
        const response = await api.post('/auth/logout');
        return response.data;
    }
};

export const couponApi = {
    claim: async () => {
        const response = await api.post('/coupons/claim');
        return response.data;
    },
    verify: async (code: string) => {
        const response = await api.get(`/coupons/verify/${code}`);
        return response.data;
    }
};

export const adminApi = {
    getCoupons: async () => {
        const response = await api.get('/admin/coupons');
        return response.data;
    },
    addCoupon: async (coupon: Partial<Coupon>) => {
        const response = await api.post('/admin/coupons', coupon);
        return response.data;
    },
    updateCoupon: async (id: string, updates: Partial<Coupon>) => {
        const response = await api.put(`/admin/coupons/${id}`, updates);
        return response.data;
    },
    getClaims: async () => {
        const response = await api.get('/admin/claims');
        return response.data;
    },
    bulkUpload: async (coupons: Partial<Coupon>[]) => {
        const response = await api.post('/admin/coupons/bulk', { coupons });
        return response.data;
    }
}; 
