import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { Leaf } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { user, login, register } = useAuth();
    const navigate = useNavigate();

    if (user) {
        return <Navigate to="/" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isRegistering) {
                await register(name, email, password);
                toast.success('Account created successfully!');
            } else {
                await login(email, password);
                toast.success('Welcome back!');
            }
            navigate('/');
        } catch (error) {
            console.error(error);
            // Provide friendly error messages
            let msg = 'Authentication failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') msg = 'Email is already registered.';
            if (error.code === 'auth/invalid-credential') msg = 'Invalid email or password.';
            if (error.code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
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

            <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>Agri-U</h1>
            <p style={{ textAlign: 'center', marginBottom: '32px', color: 'var(--text-secondary)' }}>Your agricultural learning companion.</p>

            <form onSubmit={handleSubmit} className="card" style={{ width: '100%', maxWidth: '360px' }}>
                <h3 style={{ marginBottom: '16px' }}>{isRegistering ? 'Create Account' : 'Sign In'}</h3>

                {isRegistering && (
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Farmer Jo"
                            required={isRegistering}
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
                )}

                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="agriu@example.com"
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

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
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

                <button type="submit" className="btn btn-primary" style={{ width: '100%', opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
                    {isLoading ? 'Processing...' : (isRegistering ? 'Register' : 'Access Dashboard')}
                </button>

                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    {isRegistering ? 'Already have an account?' : 'New to Agri-U?'} <br />
                    <span
                        style={{ color: 'var(--primary-green)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => setIsRegistering(!isRegistering)}
                    >
                        {isRegistering ? 'Sign In Here' : 'Create an Account'}
                    </span>
                </p>
            </form>
        </div>
    );
}
