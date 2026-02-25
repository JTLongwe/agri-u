import React, { useState, useEffect } from 'react';
import { lessons } from '../data/mockData';
import { storage } from '../utils/storage';
import { Download, CloudOff, CheckCircle2, Search } from 'lucide-react';
import { useNetwork } from '../utils/useNetwork';
import { useNavigate } from 'react-router-dom';

export default function Learn() {
    const isOnline = useNetwork();
    const navigate = useNavigate();
    const [savedLessons, setSavedLessons] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All Courses');
    const [searchQuery, setSearchQuery] = useState('');
    const categories = ['All Courses', 'Water', 'Crops', 'Soil'];

    useEffect(() => {
        loadSaved();
    }, []);

    const loadSaved = async () => {
        const saved = await storage.getSavedLessons();
        setSavedLessons(saved.map(l => l.id));
    };

    const handleDownload = async (lesson) => {
        await storage.saveLesson(lesson);
        loadSaved();
        // Simulate updating overall progress slightly
        let currentProg = await storage.getProgress();
        if (currentProg < 100) {
            await storage.updateProgress(Math.min(100, currentProg + 15));
        }
    };

    return (
        <div className="fade-in-up">
            <h1>Library 📚</h1>
            <p>Download modules for offline viewing.</p>

            <div style={{ position: 'relative', marginBottom: '24px' }}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics..."
                    style={{
                        width: '100%',
                        padding: '12px 16px 12px 40px',
                        borderRadius: 'var(--border-radius-pill)',
                        border: 'none',
                        boxShadow: 'var(--shadow-sm)',
                        fontSize: '15px'
                    }}
                />
                <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '8px' }}>
                {categories.map(cat => (
                    <span
                        key={cat}
                        className="badge"
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            background: activeCategory === cat ? 'var(--primary-green)' : 'var(--surface-color)',
                            color: activeCategory === cat ? 'white' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                        }}>
                        {cat}
                    </span>
                ))}
            </div>

            <div className="course-list">
                {lessons
                    .filter(lesson => activeCategory === 'All Courses' || lesson.category === activeCategory)
                    .filter(lesson => lesson.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((lesson) => {
                        const isSaved = savedLessons.includes(lesson.id);

                        return (
                            <div key={lesson.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ height: '140px', position: 'relative' }}>
                                    <img
                                        src={lesson.image}
                                        alt={lesson.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                                        <span className="badge" style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--primary-green)' }}>
                                            {lesson.category}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ padding: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <h3 style={{ margin: 0 }}>{lesson.title}</h3>
                                        {isSaved && <CheckCircle2 color="var(--primary-green)" size={20} />}
                                    </div>
                                    <p style={{ fontSize: '13px', marginBottom: '16px' }}>{lesson.duration} &bull; Earn: {lesson.awardedBadge}</p>

                                    {isSaved ? (
                                        <button className="btn btn-secondary" onClick={() => navigate(`/lesson/${lesson.id}`)}>Read Offline</button>
                                    ) : (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleDownload(lesson)}
                                            disabled={!isOnline}
                                            style={{ opacity: isOnline ? 1 : 0.5 }}
                                        >
                                            {isOnline ? <Download size={18} /> : <CloudOff size={18} />}
                                            {isOnline ? 'Download File' : 'Offline'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
