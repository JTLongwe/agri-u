import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Users, User } from 'lucide-react';
import { useNetwork } from '../utils/useNetwork';
import { useAuth } from '../utils/AuthContext';
import { useTranslation } from 'react-i18next';

const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        style={({ isActive }) => ({
            color: isActive ? 'var(--primary-green)' : 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: '11px',
            fontWeight: isActive ? '700' : '500',
            transition: 'color 0.2s',
            padding: '8px 0',
            width: '60px'
        })}
    >
        <Icon size={24} style={{ marginBottom: '4px' }} />
        {label}
    </NavLink>
);

export function Header() {
    const isOnline = useNetwork();
    const { user } = useAuth();
    const { i18n } = useTranslation();
    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'F';

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            maxWidth: '480px',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'var(--shadow-sm)'
        }}>
            {!isOnline && (
                <div className="offline-banner">
                    Offline Mode Active
                </div>
            )}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--primary-green)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }}>A</div>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary-green)' }}>Agri-U</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <select
                        value={i18n.language}
                        onChange={(e) => changeLanguage(e.target.value)}
                        style={{
                            padding: '4px 8px',
                            borderRadius: 'var(--border-radius-pill)',
                            border: '1px solid var(--border-color)',
                            background: 'white',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="en">EN</option>
                        <option value="sw">SW</option>
                        <option value="fr">FR</option>
                    </select>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                        {userInitial}
                    </div>
                </div>
            </div>
        </header >
    );
}

export function BottomNav() {
    const { t } = useTranslation();

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            maxWidth: '480px',
            zIndex: 10,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 -4px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '8px 0',
            paddingBottom: 'calc(8px + env(safe-area-inset-bottom))'
        }}>
            <NavItem to="/" icon={Home} label={t('dashboard')} />
            <NavItem to="/learn" icon={BookOpen} label={t('learn')} />
            <NavItem to="/community" icon={Users} label={t('community')} />
            <NavItem to="/profile" icon={User} label={t('profile')} />
        </nav>
    );
}

export function Layout({ children }) {
    return (
        <>
            <Header />
            <main className="main-content">
                {children}
            </main>
            <BottomNav />
        </>
    );
}
