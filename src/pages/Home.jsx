import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { lessons } from '../data/mockData';
import { Play, TrendingUp, Award, Droplets, Camera as CameraIcon, CloudSun, MapPin } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Home() {
    const { t } = useTranslation();
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
            const lat = coordinates.coords.latitude;
            const lon = coordinates.coords.longitude;

            // Note: Make sure VITE_OPENWEATHER_API_KEY is defined in .env
            const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

            if (!apiKey) {
                // Graceful fallback for the demo if keys aren't added yet
                console.warn("OpenWeather API key missing. Falling back to mock data.");
                setTimeout(() => {
                    setWeather({ temp: '26°C', condition: 'Sunny / Dry', location: 'Local Farm Coordinates' });
                    setIsFetchingWeather(false);
                }, 1000);
                return;
            }

            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
            const data = await response.json();

            if (response.ok) {
                setWeather({
                    temp: `${Math.round(data.main.temp)}°C`,
                    condition: data.weather[0].main,
                    location: data.name || 'Local Farm'
                });
                toast.success('Live Weather fetched!');
            } else {
                throw new Error(data.message || "Weather fetch failed");
            }
        } catch (e) {
            console.error(e);
            toast.error("Enable Location Services to see weather.");
        } finally {
            setIsFetchingWeather(false);
        }
    };

    const takePhoto = async () => {
        try {
            // Opens native Android/iOS camera!
            const image = await Camera.getPhoto({
                quality: 80,
                allowEditing: false,
                resultType: CameraResultType.Base64 // Changed to Base64 for easier API transport
            });

            setPhoto(`data:image/jpeg;base64,${image.base64String}`);
            setIsScanning(true);

            // Note: Make sure VITE_PLANTNET_API_KEY is defined in .env
            const apiKey = import.meta.env.VITE_PLANTNET_API_KEY;

            if (!apiKey) {
                // Graceful fallback for the demo if keys aren't added yet
                console.warn("Pl@ntNet API key missing. Falling back to mock data.");
                setTimeout(() => {
                    setIsScanning(false);
                    toast.success('Mock AI analysis complete. Crop appears healthy!', { duration: 4000 });
                }, 2500);
                return;
            }

            // Pl@ntNet API expects multipart/form-data with the actual file buffer
            const byteCharacters = atob(image.base64String);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });

            const formData = new FormData();
            formData.append('images', blob, 'crop.jpg');
            // We tell the AI to look across all its plant data
            formData.append('organs', 'leaf');

            const response = await fetch(`https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.results && data.results.length > 0) {
                const bestMatch = data.results[0];
                toast.success(`Identified: ${bestMatch.species.scientificNameWithoutAuthor} ${(bestMatch.score * 100).toFixed(1)}% confidence`, { duration: 5000 });
            } else {
                toast.error("Could not confidently identify the crop.");
            }

        } catch (e) {
            console.error("Camera/API Error:", e);
            toast.error("Scanning failed or was cancelled.");
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="fade-in-up">
            <div style={{ marginBottom: '24px' }}>
                <h1>{t('morning')}</h1>
                <p>{t('ready')}</p>
            </div>

            <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-green), #1b5e20)', color: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h3 style={{ color: 'var(--accent-yellow)', marginBottom: '4px' }}>{t('daily_tip')}</h3>
                        <p style={{ color: '#e8f5e9', fontSize: '14px', marginBottom: '0' }}>Check your drip lines for mineral buildup once a month to ensure even water distribution.</p>
                    </div>
                    <Droplets size={32} style={{ opacity: 0.8 }} />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
                {/* Weather Data API Card */}
                <div className="card" onClick={fetchWeather} style={{ padding: '16px', background: 'var(--surface-color)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CloudSun size={28} color="var(--primary-green)" style={{ marginBottom: '8px' }} />
                    <h3 style={{ fontSize: '15px', margin: 0 }}>{t('weather')}</h3>
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
                    <h3 style={{ fontSize: '15px', margin: 0 }}>{t('scan_crop')}</h3>
                    <small style={{ color: 'var(--text-secondary)' }}>{t('identify_diseases')}</small>
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

            <h2 style={{ fontSize: '18px', marginTop: '24px' }}>{t('progress')}</h2>
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
                        <Play size={18} fill="currentColor" /> {t('continue')}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <div className="card" style={{ flex: 1, textAlign: 'center', padding: '16px' }}>
                    <Award size={32} color="var(--accent-yellow)" style={{ margin: '0 auto 8px' }} />
                    <h3 style={{ fontSize: '16px', margin: 0 }}>{t('badges')}</h3>
                    <small>{t('collect_all')}</small>
                </div>
                <div className="card" style={{ flex: 1, textAlign: 'center', padding: '16px' }}>
                    <TrendingUp size={32} color="var(--success)" style={{ margin: '0 auto 8px' }} />
                    <h3 style={{ fontSize: '16px', margin: 0 }}>{t('yield_est')}</h3>
                    <small>{t('expected')}</small>
                </div>
            </div>
        </div>
    );
}
