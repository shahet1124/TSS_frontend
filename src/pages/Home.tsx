import React, { useState } from 'react';
import { couponApi } from '../services/api.ts';

const Home: React.FC = () => {
    const [coupon, setCoupon] = useState<any>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const handleClaimCoupon = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await couponApi.claim();
            setCoupon(response.coupon);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to claim coupon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card">
                <h2>Welcome to Coupon Distribution</h2>
                <p>Click the button below to claim your exclusive coupon!</p>
                
                {error && <div className="error">{error}</div>}
                
                {coupon ? (
                    <div className="coupon-card">
                        <h3>🎉 Congratulations!</h3>
                        <div className="coupon-code">{coupon.code}</div>
                        <div className="coupon-value">${coupon.value}</div>
                        <div className="coupon-description">{coupon.description}</div>
                        <div className="coupon-expiry">
                            Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                        </div>
                    </div>
                ) : (
                    <button 
                        className="button" 
                        onClick={handleClaimCoupon}
                        disabled={loading}
                    >
                        {loading ? '🎁 Claiming...' : '🎁 Claim Your Coupon'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Home; 