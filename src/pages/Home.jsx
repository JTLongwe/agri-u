import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { lessons } from '../data/mockData';
import { Play, TrendingUp, Award, Droplets } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';

export default function Home() {
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            storage.getProgress(user.uid).then(setProgress);
        }
    }, [user]);

    return (
        <div className="fade-in-up">
            <div style={{ marginBottom: '24px' }}>
                <h1>Morning, Farmer! 🌾</h1>
                <p>Ready to improve your harvest today?</p>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-green), #1b5e20)', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ color: 'var(--accent-yellow)', marginBottom: '4px' }}>Daily Tip</h3>
                        <p style={{ color: '#e8f5e9', fontSize: '14px', marginBottom: '0' }}>Check your drip lines for mineral buildup once a month to ensure even water distribution.</p>
                    </div>
                    <Droplets size={32} style={{ opacity: 0.8 }} />
                </div>
            </div>

            <h2 style={{ fontSize: '18px', marginTop: '24px' }}>Your Progress</h2>
            <div className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600' }}>Climate-Smart Basics</span>
                    <span style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>{progress}%</span>
                </div>
                <div className="progress-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button className="btn btn-primary" onClick={() => navigate('/learn')}>
                        <Play size={18} fill="currentColor" /> Continue Learning
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <div className="card" style={{ flex: 1, textAlign: 'center', padding: '16px' }}>
                    <Award size={32} color="var(--accent-yellow)" style={{ margin: '0 auto 8px' }} />
                    <h3 style={{ fontSize: '16px', margin: 0 }}>Agri-U Badges</h3>
                    <small>Collect them all</small>
                </div>
                <div className="card" style={{ flex: 1, textAlign: 'center', padding: '16px' }}>
                    <TrendingUp size={32} color="var(--success)" style={{ margin: '0 auto 8px' }} />
                    <h3 style={{ fontSize: '16px', margin: 0 }}>Yield Est.</h3>
                    <small>+15% Expected</small>
                </div>
            </div>
        </div>
    );
}
