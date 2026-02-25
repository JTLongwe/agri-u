import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessons } from '../data/mockData';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { storage } from '../utils/storage';

export default function LessonView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        const found = lessons.find(l => l.id === id);
        setLesson(found);
    }, [id]);

    const handleComplete = async () => {
        setCompleted(true);
        let currentProg = await storage.getProgress();
        if (currentProg < 100) {
            await storage.updateProgress(Math.min(100, currentProg + 25));
        }
        setTimeout(() => {
            navigate(-1);
        }, 1500);
    };

    if (!lesson) return <div style={{ padding: '20px' }}>Loading...</div>;

    return (
        <div className="fade-in-up" style={{ paddingBottom: '40px' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn"
                style={{ width: 'auto', padding: '8px 0', background: 'transparent', color: 'var(--text-primary)', marginBottom: '16px', boxShadow: 'none' }}
            >
                <ArrowLeft size={24} style={{ marginRight: '4px' }} /> Back
            </button>

            <img src={lesson.image} alt={lesson.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--border-radius)', marginBottom: '16px' }} />
            <span className="badge" style={{ background: 'var(--light-green)', color: 'var(--primary-green)', marginBottom: '12px' }}>{lesson.category}</span>
            <h1 style={{ marginTop: '8px' }}>{lesson.title}</h1>
            <p style={{ color: 'var(--text-primary)', fontSize: '16px', lineHeight: '1.6', marginTop: '16px' }}>{lesson.content}</p>

            <div className="card" style={{ marginTop: '32px', textAlign: 'center', background: completed ? 'var(--light-green)' : '#fff8e1', transition: 'background 0.3s' }}>
                {completed ? (
                    <>
                        <CheckCircle2 size={48} color="var(--primary-green)" style={{ margin: '0 auto 12px' }} />
                        <h3 style={{ color: 'var(--primary-green)' }}>Lesson Completed!</h3>
                        <p style={{ fontSize: '14px', marginBottom: '0' }}>You earned the {lesson.awardedBadge} badge!</p>
                    </>
                ) : (
                    <>
                        <h3 style={{ color: '#f57f17' }}>Mark as Completed</h3>
                        <p style={{ fontSize: '14px', marginBottom: '16px' }}>Finish reading to earn your {lesson.awardedBadge} badge!</p>
                        <button className="btn btn-primary" onClick={handleComplete} style={{ background: '#fbc02d', color: '#1a1a1a', boxShadow: 'none' }}>
                            Complete Lesson
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
