import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Shield, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../utils/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Admin() {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Basics');
    const [duration, setDuration] = useState('5 min');
    const [content, setContent] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);

    // Simple auth check - in production you would verify custom claims or an admin array
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const handlePublish = async (e) => {
        e.preventDefault();
        setIsPublishing(true);

        try {
            // Convert paragraphs split by double newline into array for the LessonView component
            const textParagraphs = content.split('\n\n').filter(p => p.trim() !== '');

            const newLesson = {
                title,
                category,
                duration,
                icon: '📚', // Default icon
                text: textParagraphs,
                quiz: {
                    question: `What is the key takeaway from ${title}?`,
                    options: ['The first paragraph', 'The conclusion', 'Applying the knowledge', 'None of the above'],
                    correctIndex: 2
                },
                createdAt: new Date().toISOString(),
                publishedBy: user.uid
            };

            await addDoc(collection(db, 'lessons'), newLesson);

            toast.success("Lesson published successfully to all users!");
            setTitle('');
            setContent('');
        } catch (error) {
            console.error(error);
            toast.error("Failed to publish lesson.");
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <Shield size={32} color="var(--primary-green)" />
                <div>
                    <h1 style={{ margin: 0 }}>Content Admin</h1>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Publish new lessons to Agri-U</p>
                </div>
            </div>

            <form className="card" onSubmit={handlePublish}>
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Lesson Title</label>
                    <input
                        required
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                        >
                            <option>Basics</option>
                            <option>Water</option>
                            <option>Soil</option>
                            <option>Crops</option>
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Est. Duration</label>
                        <input
                            required
                            value={duration}
                            onChange={e => setDuration(e.target.value)}
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                        />
                    </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Lesson Content (Paragraphs separated by blank line)</label>
                    <textarea
                        required
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={8}
                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px' }}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isPublishing}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                    <Plus size={20} /> {isPublishing ? 'Publishing to Cloud...' : 'Publish Course'}
                </button>
            </form>
        </div>
    );
}
