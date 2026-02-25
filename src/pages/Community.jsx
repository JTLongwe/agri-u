import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2, Trash2, Languages } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../utils/AuthContext';
import { db } from '../config/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy, serverTimestamp, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import translate from 'translate';
import { useTranslation } from 'react-i18next';

export default function Community() {
    const [feed, setFeed] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [translatingId, setTranslatingId] = useState(null);
    const { user } = useAuth();
    const { i18n } = useTranslation();

    // Configure Translate wrapper (defaults to Google free tier)
    translate.engine = 'google';

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFeed(postsData);
            setLoading(false);
        }, (error) => {
            console.error("Firestore error: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handlePost = async () => {
        if (!newPost.trim() || !user) return;
        try {
            await addDoc(collection(db, 'posts'), {
                user: user.name,
                userId: user.uid,
                text: newPost,
                timestamp: serverTimestamp(),
                likes: [],
                comments: 0
            });
            setNewPost('');
            toast.success('Posted successfully');
        } catch (error) {
            console.error("Error adding post: ", error);
            toast.error("Ensure you are logged in to post");
        }
    };

    const handleLike = async (post) => {
        if (!user) return;
        const postRef = doc(db, 'posts', post.id);
        const hasLiked = post.likes && post.likes.includes(user.uid);
        try {
            if (hasLiked) {
                await updateDoc(postRef, {
                    likes: arrayRemove(user.uid)
                });
            } else {
                await updateDoc(postRef, {
                    likes: arrayUnion(user.uid)
                });
            }
        } catch (error) {
            console.error("Error updating like status: ", error);
        }
    };

    const handleDelete = async (id) => {
        toast.custom((t) => (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--error)', padding: '16px' }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>Delete post?</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn" style={{ padding: '4px 12px' }} onClick={() => toast.dismiss(t.id)}>Cancel</button>
                    <button className="btn btn-primary" style={{ background: 'var(--error)', padding: '4px 12px' }} onClick={async () => {
                        toast.dismiss(t.id);
                        await deleteDoc(doc(db, 'posts', id));
                        toast.success('Post deleted');
                    }}>Delete</button>
                </div>
            </div>
        ));
    }

    const handleShare = () => {
        toast.success("Link copied to clipboard!");
    };

    // Helper to format Firebase timestamp
    const formatTime = (firebaseTimestamp) => {
        if (!firebaseTimestamp) return 'Just now';
        const date = firebaseTimestamp.toDate();
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.round(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return `${Math.floor(diffHrs / 24)}d ago`;
    };

    const handleTranslate = async (post, targetLang) => {
        if (post.translatedText) return;

        setTranslatingId(post.id);
        try {
            // Translate the text 
            const result = await translate(post.text, targetLang);

            // Update local feed state so we don't spam the DB with translations
            setFeed(prevFeed => prevFeed.map(p => {
                if (p.id === post.id) {
                    return { ...p, translatedText: result };
                }
                return p;
            }));
            toast.success(`Translated to ${targetLang}`);
        } catch (error) {
            console.error(error);
            toast.error("Translation API failed");
        } finally {
            setTranslatingId(null);
        }
    };

    return (
        <div className="fade-in-up">
            <h1>Community 🌍</h1>
            <p>Connect with other farmers across regions.</p>

            <div className="card" style={{ marginBottom: '24px', position: 'relative' }}>
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Ask a question or share a tip..."
                    style={{
                        width: '100%',
                        border: 'none',
                        background: 'var(--bg-color)',
                        padding: '12px',
                        borderRadius: 'var(--border-radius-sm)',
                        resize: 'none',
                        height: '80px',
                        fontFamily: 'inherit',
                        marginBottom: '12px'
                    }}
                />
                <button className="btn btn-primary" onClick={handlePost} style={{ padding: '8px 16px', borderRadius: 'var(--border-radius-pill)', width: 'auto', float: 'right' }}>
                    Post
                </button>
                <div style={{ clear: 'both' }}></div>
            </div>

            <div className="feed">
                {loading ? (
                    <>
                        <div className="card">
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                <div className="skeleton skeleton-avatar"></div>
                                <div>
                                    <div className="skeleton skeleton-text" style={{ width: '100px' }}></div>
                                    <div className="skeleton skeleton-text" style={{ width: '60px' }}></div>
                                </div>
                            </div>
                            <div className="skeleton skeleton-text" style={{ width: '100%', height: '40px' }}></div>
                        </div>
                        <div className="card">
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                                <div className="skeleton skeleton-avatar"></div>
                                <div>
                                    <div className="skeleton skeleton-text" style={{ width: '80px' }}></div>
                                    <div className="skeleton skeleton-text" style={{ width: '50px' }}></div>
                                </div>
                            </div>
                            <div className="skeleton skeleton-text" style={{ width: '80%', height: '20px' }}></div>
                        </div>
                    </>
                ) : (
                    <>
                        {feed.map(post => {
                            const hasLiked = user && post.likes && post.likes.includes(user.uid);
                            const likeCount = post.likes ? post.likes.length : 0;
                            const isOwner = user && user.uid === post.userId;

                            return (
                                <div key={post.id} className="card" style={{ position: 'relative' }}>
                                    {isOwner && (
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: 'var(--primary-green)', color: 'white',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 'bold'
                                        }}>
                                            {post.user ? post.user.charAt(0).toUpperCase() : 'F'}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '15px' }}>{post.user || 'Farmer'}</h3>
                                            <small>{formatTime(post.timestamp)}</small>
                                        </div>
                                    </div>

                                    <p style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
                                        {post.translatedText || post.text}
                                    </p>

                                    <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)', fontSize: '14px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                                        <div onClick={() => handleLike(post)} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: hasLiked ? 'var(--error)' : 'inherit', transition: 'transform 0.2s', transform: hasLiked ? 'scale(1.1)' : 'scale(1)' }}>
                                            <Heart size={18} fill={hasLiked ? 'currentColor' : 'none'} style={{ transition: 'all 0.2s' }} /> {likeCount}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                            <MessageSquare size={18} /> {post.comments || 0}
                                        </div>
                                        {!post.translatedText && (
                                            <div onClick={() => handleTranslate(post, i18n.language)} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', opacity: translatingId === post.id ? 0.5 : 1 }}>
                                                <Languages size={18} /> Translate
                                            </div>
                                        )}
                                        <div onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginLeft: 'auto' }}>
                                            <Share2 size={18} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {!loading && feed.length === 0 && (
                            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
                                No posts yet. Be the first to share an update! 🚜
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
