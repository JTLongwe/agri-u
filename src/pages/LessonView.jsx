import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { lessons as mockLessons } from '../data/mockData';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { storage } from '../utils/storage';
import { useAuth } from '../utils/AuthContext';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

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
        const fetchLesson = async () => {
            try {
                // First try pulling from Firestore
                const docRef = doc(db, 'lessons', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setLesson({ id: docSnap.id, ...docSnap.data() });
                } else {
                    // Fall back to local mock data if internet is down or it's a legacy ID
                    const found = mockLessons.find(l => l.id === id);
                    if (found) setLesson(found);
                    else throw new Error("Lesson not found");
                }
            } catch (e) {
                console.error("Failed to fetch lesson via cloud", e);
                // Fall back to local mock data
                const found = mockLessons.find(l => l.id === id);
                if (found) setLesson(found);
            }
        };
        fetchLesson();
    }, [id]);

    const handleAnswerSelect = (index) => {
        setSelectedAnswer(index);
        // Accommodate both legacy format (correctAnswer integer) and new format (correctIndex)
        const isCorrect = (lesson.quiz.correctAnswer !== undefined && index === lesson.quiz.correctAnswer) ||
            (lesson.quiz.correctIndex !== undefined && index === lesson.quiz.correctIndex);

        if (isCorrect) {
            setQuizPassed(true);
        } else {
            setQuizPassed(false);
        }
    };

    const handleComplete = async () => {
        if (!user || !quizPassed) return;
        setCompleted(true);

        // Award badge (works for both legacy mock formats and new generic cloud formats)
        const badgeName = lesson.awardedBadge || `${lesson.category} Master`;
        await storage.awardBadge(user.uid, badgeName);

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

        toast.success(`Badge Earned: ${badgeName}!`);

        setTimeout(() => {
            navigate(-1);
        }, 2000);
    };

    if (!lesson) return <div style={{ padding: '20px' }}>Loading Lesson Data...</div>;

    return (
        <div className="fade-in-up" style={{ paddingBottom: '40px' }}>
            <button
                onClick={() => navigate(-1)}
                className="btn"
                style={{ width: 'auto', padding: '8px 0', background: 'transparent', color: 'var(--text-primary)', marginBottom: '16px', boxShadow: 'none' }}
            >
                <ArrowLeft size={24} style={{ marginRight: '4px' }} /> Back
            </button>

            {lesson.image ? (
                <img src={lesson.image} alt={lesson.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--border-radius)', marginBottom: '16px' }} />
            ) : (
                <div style={{ width: '100%', height: '140px', background: 'var(--surface-color)', borderRadius: 'var(--border-radius)', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>
                    {lesson.icon || '📚'}
                </div>
            )}

            <span className="badge" style={{ background: 'var(--light-green)', color: 'var(--primary-green)', marginBottom: '12px' }}>{lesson.category}</span>
            <h1 style={{ marginTop: '8px' }}>{lesson.title}</h1>

            <div style={{ color: 'var(--text-primary)', fontSize: '16px', lineHeight: '1.6', marginTop: '16px' }}>
                {Array.isArray(lesson.text) ? (
                    // New dynamic cloud format mapping
                    lesson.text.map((paragraph, i) => <p key={i} style={{ marginBottom: '16px' }}>{paragraph}</p>)
                ) : (
                    // Legacy mock format
                    <p style={{ whiteSpace: 'pre-line' }}>{lesson.content}</p>
                )}
            </div>

            {lesson.quiz && !completed && (
                <div className="card" style={{ marginTop: '24px', background: 'var(--surface-color)', border: '1px solid #eee' }}>
                    <h3 style={{ marginBottom: '16px' }}>Knowledge Check 🧠</h3>
                    <p style={{ fontWeight: '600', marginBottom: '12px' }}>{lesson.quiz.question}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {lesson.quiz.options.map((option, idx) => {
                            let btnStyle = { textAlign: 'left', padding: '12px', background: 'var(--bg-color)', color: 'var(--text-primary)' };

                            if (selectedAnswer === idx) {
                                const isCorrectIdx = lesson.quiz.correctAnswer !== undefined ? lesson.quiz.correctAnswer : lesson.quiz.correctIndex;
                                if (idx === isCorrectIdx) {
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
