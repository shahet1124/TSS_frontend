import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

const Header: React.FC = () => {
    const { admin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="header">
            <nav className="nav">
                <Link to="/" className="nav-link">
                    <h1>Coupon Distribution</h1>
                </Link>
                <div className="nav-links">
                    {admin ? (
                        <>
                            <Link to="/admin" className="nav-link">Dashboard</Link>
                            <button onClick={handleLogout} className="button">
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/admin/login" className="nav-link">Admin Login</Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header; 