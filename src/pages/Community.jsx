import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2, Trash2 } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';
import { db } from '../config/firebase';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy, serverTimestamp, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';

export default function Community() {
    const [feed, setFeed] = useState([]);
    const [newPost, setNewPost] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFeed(postsData);
        }, (error) => {
            console.error("Firestore error: ", error);
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
        } catch (error) {
            console.error("Error adding post: ", error);
            alert("Ensure you are logged in to post!");
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
        if (window.confirm("Are you sure you want to delete this post?")) {
            await deleteDoc(doc(db, 'posts', id));
        }
    }

    const handleShare = () => {
        alert("Link copied to clipboard!");
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

                            <p style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>{post.text}</p>

                            <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)', fontSize: '14px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                                <div onClick={() => handleLike(post)} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: hasLiked ? 'var(--error)' : 'inherit' }}>
                                    <Heart size={18} fill={hasLiked ? 'currentColor' : 'none'} /> {likeCount}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                    <MessageSquare size={18} /> {post.comments || 0}
                                </div>
                                <div onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', marginLeft: 'auto' }}>
                                    <Share2 size={18} />
                                </div>
                            </div>
                        </div>
                    );
                })}
                {feed.length === 0 && (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
                        No posts yet. Be the first to share an update! 🚜
                    </div>
                )}
            </div>
        </div>
    );
}
