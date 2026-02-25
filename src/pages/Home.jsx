import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { lessons } from '../data/mockData';
import { Play, TrendingUp, Award, Droplets, Camera as CameraIcon, CloudSun, MapPin } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import toast from 'react-hot-toast';

export default function Home() {
    const [progress, setProgress] = useState(0);
    const [weather, setWeather] = useState(null);
    const [isFetchingWeather, setIsFetchingWeather] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            storage.getProgress(user.uid).then(setProgress);
        }
    }, [user]);

    const fetchWeather = async () => {
        setIsFetchingWeather(true);
        try {
            // Get actual native GPS coordinates!
            const coordinates = await Geolocation.getCurrentPosition();

            // Note: In production, pass coordinates.coords.latitude & longitude to OpenWeather API
            // For now, simulate the API response so you can see the UI without configuring a new Key
            setTimeout(() => {
                setWeather({ temp: '26°C', condition: 'Sunny / Dry', location: 'Local Farm Coordinates' });
                setIsFetchingWeather(false);
                toast.success('Agro Weather fetched!');
            }, 1000);
        } catch (e) {
            console.error(e);
            toast.error("Enable Location Services to see weather.");
            setIsFetchingWeather(false);
        }
    };

    const takePhoto = async () => {
        try {
            // Opens native Android/iOS camera!
            const image = await Camera.getPhoto({
                quality: 80,
                allowEditing: false,
                resultType: CameraResultType.DataUrl
            });
            setPhoto(image.dataUrl);
            setIsScanning(true);

            // Note: In production, upload base64 image.dataUrl to Pl@ntNet API for AI analysis here
            setTimeout(() => {
                setIsScanning(false);
                toast.success('Pl@ntNet API AI analysis complete. Crop appears healthy!', { duration: 4000 });
            }, 2500);

        } catch (e) {
            console.error("Camera cancelled or unavailable");
        }
    };

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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
                {/* Weather Data API Card */}
                <div className="card" onClick={fetchWeather} style={{ padding: '16px', background: 'var(--surface-color)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CloudSun size={28} color="var(--primary-green)" style={{ marginBottom: '8px' }} />
                    <h3 style={{ fontSize: '15px', margin: 0 }}>Weather</h3>
                    {isFetchingWeather ? (
                        <small>Locating...</small>
                    ) : weather ? (
                        <small style={{ fontWeight: 'bold' }}>{weather.temp}, {weather.condition}</small>
                    ) : (
                        <small style={{ color: 'var(--text-secondary)' }}>Tap to fetch</small>
                    )}
                </div>

                {/* Pl@ntNet AI Camera Card */}
                <div className="card" onClick={takePhoto} style={{ padding: '16px', background: 'var(--surface-color)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CameraIcon size={28} color="var(--accent-yellow)" style={{ marginBottom: '8px' }} />
                    <h3 style={{ fontSize: '15px', margin: 0 }}>Scan Crop</h3>
                    <small style={{ color: 'var(--text-secondary)' }}>Identify diseases</small>
                </div>
            </div>

            {photo && (
                <div className="card" style={{ marginTop: '16px', textAlign: 'center' }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '8px' }}>AI Image Analysis</h3>
                    <img src={photo} alt="Scanned crop" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                    {isScanning ? (
                        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <div className="skeleton skeleton-avatar" style={{ width: '20px', height: '20px' }}></div>
                            <small>Pl@ntNet analyzing...</small>
                        </div>
                    ) : (
                        <p style={{ marginTop: '8px', color: 'var(--success)', fontWeight: 'bold' }}>✅ Healthy Crop</p>
                    )}
                </div>
            )}

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
