import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api.ts';
import { Coupon } from '../types';

const AdminDashboard: React.FC = () => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [claims, setClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        value: '',
        description: '',
        expiryDate: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [couponsData, claimsData] = await Promise.all([
                adminApi.getCoupons(),
                adminApi.getClaims()
            ]);
            setCoupons(couponsData);
            setClaims(claimsData);
        } catch (err) {
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminApi.addCoupon({
                ...newCoupon,
                value: Number(newCoupon.value),
                expiryDate: new Date(newCoupon.expiryDate)
            });
            setNewCoupon({ code: '', value: '', description: '', expiryDate: '' });
            loadData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add coupon');
        }
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        try {
            await adminApi.updateCoupon(id, { isActive });
            loadData();
        } catch (err) {
            setError('Failed to update coupon');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    const activeCoupons = coupons.filter(c => c.isActive && !c.isUsed).length;
    const totalClaims = claims.length;
    const totalValue = claims.reduce((sum, claim) => sum + claim.value, 0);

    return (
        <div className="container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Admin Dashboard</h1>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">{activeCoupons}</div>
                    <div className="stat-label">Active Coupons</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{totalClaims}</div>
                    <div className="stat-label">Total Claims</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">${totalValue}</div>
                    <div className="stat-label">Total Value Claimed</div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Add New Coupon</h3>
                </div>
                <form onSubmit={handleAddCoupon} className="form">
                    <div className="form-group">
                        <label htmlFor="code">Coupon Code</label>
                        <input
                            type="text"
                            id="code"
                            placeholder="Enter coupon code"
                            value={newCoupon.code}
                            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="value">Value</label>
                        <input
                            type="number"
                            id="value"
                            placeholder="Enter coupon value"
                            value={newCoupon.value}
                            onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            id="description"
                            placeholder="Enter coupon description"
                            value={newCoupon.description}
                            onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <input
                            type="datetime-local"
                            id="expiryDate"
                            value={newCoupon.expiryDate}
                            onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="button button-primary">Add Coupon</button>
                </form>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Active Coupons</h3>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Value</th>
                                <th>Description</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.map((coupon) => (
                                <tr key={coupon._id}>
                                    <td>{coupon.code}</td>
                                    <td>${coupon.value}</td>
                                    <td>{coupon.description}</td>
                                    <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status ${coupon.isUsed ? 'used' : (coupon.isActive ? 'active' : 'inactive')}`}>
                                            {coupon.isUsed ? 'Used' : (coupon.isActive ? 'Active' : 'Inactive')}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className={`button ${coupon.isActive ? 'button-danger' : 'button-primary'}`}
                                            onClick={() => handleToggleActive(coupon._id, !coupon.isActive)}
                                            disabled={coupon.isUsed}
                                        >
                                            {coupon.isActive ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Claim History</h3>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>IP Address</th>
                                <th>Claimed At</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {claims.map((claim) => (
                                <tr key={claim._id}>
                                    <td>{claim.code}</td>
                                    <td>{claim.claimedBy.ip}</td>
                                    <td>{new Date(claim.claimedBy.claimedAt).toLocaleString()}</td>
                                    <td>${claim.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 