import React, { useState } from 'react';
import { Award, ShieldCheck, MapPin, Edit3 } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';

export default function Profile() {
    const { user, logout, login } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(user?.name || 'Farmer Jo');
    const [editLocation, setEditLocation] = useState('Nairobi, Kenya');

    const handleSave = () => {
        login(editName);
        setIsEditing(false);
    };
    const allBadges = [
        { name: 'Water Saver', earned: true },
        { name: 'Seed Expert', earned: false },
        { name: 'Soil Master', earned: false },
        { name: 'Climate Ready', earned: false },
    ];

    return (
        <div className="fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h1>Profile 👤</h1>
                <button className="btn btn-secondary" onClick={() => setIsEditing(!isEditing)} style={{ width: 'auto', padding: '8px 16px' }}>
                    <Edit3 size={16} /> {isEditing ? 'Cancel' : 'Edit'}
                </button>
            </div>

            <div align="center" style={{ marginBottom: '32px' }}>
                <div style={{
                    width: '90px', height: '90px', borderRadius: '50%',
                    background: 'var(--accent-yellow)', color: 'var(--text-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '32px', marginBottom: '16px',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'F'}
                </div>
                {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', maxWidth: '200px', margin: '0 auto' }}>
                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <input type="text" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                        <button className="btn btn-primary" onClick={handleSave} style={{ padding: '8px 16px', marginTop: '8px' }}>Save Changes</button>
                    </div>
                ) : (
                    <>
                        <h2 style={{ margin: '0 0 4px' }}>{user?.name || 'Farmer Jo'}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                            <MapPin size={16} /> {editLocation}
                        </div>
                    </>
                )}
            </div>

            <h3 style={{ marginBottom: '16px', fontSize: '18px' }}>Certifications & Badges</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {allBadges.map((badge, idx) => (
                    <div key={idx} className="card" style={{
                        textAlign: 'center',
                        opacity: badge.earned ? 1 : 0.4,
                        filter: badge.earned ? 'none' : 'grayscale(100%)',
                        border: badge.earned ? '2px solid var(--primary-green)' : 'none'
                    }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%',
                            background: badge.earned ? 'var(--light-green)' : '#eee',
                            margin: '0 auto 12px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {badge.earned ? (
                                <ShieldCheck size={24} color="var(--primary-green)" />
                            ) : (
                                <Award size={24} color="var(--text-secondary)" />
                            )}
                        </div>
                        <h4 style={{ fontSize: '14px', margin: 0 }}>{badge.name}</h4>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '32px' }}>
                <button className="btn" onClick={logout} style={{ background: 'var(--error)', color: 'white' }}>
                    Sign Out
                </button>
            </div>
        </div>
    );
}
