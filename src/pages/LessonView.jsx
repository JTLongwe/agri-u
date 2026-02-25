import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessons } from '../data/mockData';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { storage } from '../utils/storage';
import { useAuth } from '../utils/AuthContext';
import confetti from 'canvas-confetti';

export default function LessonView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [lesson, setLesson] = useState(null);
    const [completed, setCompleted] = useState(false);

    // Quiz State
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [quizPassed, setQuizPassed] = useState(false);

    useEffect(() => {
        const found = lessons.find(l => l.id === id);
        setLesson(found);
    }, [id]);

    const handleAnswerSelect = (index) => {
        setSelectedAnswer(index);
        if (index === lesson.quiz.correctAnswer) {
            setQuizPassed(true);
        } else {
            setQuizPassed(false);
        }
    };

    const handleComplete = async () => {
        if (!user || !quizPassed) return;
        setCompleted(true);
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2E7D32', '#FBC02D', '#10b981']
        });

        let currentProg = await storage.getProgress(user.uid);
        if (currentProg < 100) {
            await storage.updateProgress(user.uid, Math.min(100, currentProg + 25));
        }
        setTimeout(() => {
            navigate(-1);
        }, 2000);
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
            <p style={{ color: 'var(--text-primary)', fontSize: '16px', lineHeight: '1.6', marginTop: '16px', whiteSpace: 'pre-line' }}>{lesson.content}</p>

            {lesson.quiz && !completed && (
                <div className="card" style={{ marginTop: '24px', background: 'var(--surface-color)', border: '1px solid #eee' }}>
                    <h3 style={{ marginBottom: '16px' }}>Knowledge Check 🧠</h3>
                    <p style={{ fontWeight: '600', marginBottom: '12px' }}>{lesson.quiz.question}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {lesson.quiz.options.map((option, idx) => {
                            let btnStyle = { textAlign: 'left', padding: '12px', background: 'var(--bg-color)', color: 'var(--text-primary)' };

                            if (selectedAnswer === idx) {
                                if (idx === lesson.quiz.correctAnswer) {
                                    btnStyle = { ...btnStyle, background: 'var(--light-green)', border: '2px solid var(--primary-green)' };
                                } else {
                                    btnStyle = { ...btnStyle, background: '#fee2e2', border: '2px solid var(--error)' };
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    className="btn btn-secondary"
                                    style={btnStyle}
                                    onClick={() => handleAnswerSelect(idx)}
                                >
                                    {option}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            <div className="card" style={{ marginTop: '32px', textAlign: 'center', background: completed ? 'var(--light-green)' : '#fff8e1', transition: 'background 0.3s' }}>
                {completed ? (
                    <>
                        <CheckCircle2 size={48} color="var(--primary-green)" style={{ margin: '0 auto 12px' }} />
                        <h3 style={{ color: 'var(--primary-green)' }}>Lesson Completed!</h3>
                        <p style={{ fontSize: '14px', marginBottom: '0' }}>You earned the {lesson.awardedBadge}!</p>
                    </>
                ) : (
                    <>
                        <h3 style={{ color: '#f57f17' }}>Earn Your Badge</h3>
                        <p style={{ fontSize: '14px', marginBottom: '16px' }}>Answer the Knowledge Check above correctly to claim your badge.</p>
                        <button
                            className="btn btn-primary"
                            onClick={handleComplete}
                            disabled={!quizPassed}
                            style={{
                                background: quizPassed ? 'var(--primary-green)' : '#ccc',
                                boxShadow: 'none',
                                opacity: quizPassed ? 1 : 0.6
                            }}>
                            {quizPassed ? "Claim Badge" : "Select an Answer"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
