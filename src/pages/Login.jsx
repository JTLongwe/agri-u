import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Leaf } from 'lucide-react';

export default function Login() {
    const [name, setName] = useState('');
    const { user, login } = useAuth();
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleLogin = (e) => {
        e.preventDefault();
        login(name);
        navigate('/');
    };

    return (
        <div className="fade-in-up" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '24px',
            background: 'var(--bg-color)'
        }}>
            <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'var(--primary-green)', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-glow)'
            }}>
                <Leaf size={40} />
            </div>

            <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>Welcome to Agri-U</h1>
            <p style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text-secondary)' }}>Your offline learning companion.</p>

            <form onSubmit={handleLogin} className="card" style={{ width: '100%', maxWidth: '360px' }}>
                <h3 style={{ marginBottom: '16px' }}>Sign In</h3>

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Your Name (for demo)</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Farmer Jo"
                        required
                        style={{
                            width: '100%',
                            padding: '12px 16px',
                            borderRadius: 'var(--border-radius-sm)',
                            border: '1px solid #ccc',
                            fontSize: '15px',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                    Continue to Dashboard
                </button>
            </form>
        </div>
    );
}
