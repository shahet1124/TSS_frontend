import axios from 'axios';
import { Coupon, LoginCredentials } from '../types';

const api = axios.create({
    baseURL: 'https://backend-gnanganga-1.onrender.com/api',
    withCredentials: true
});

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },
    logout: async () => {
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
