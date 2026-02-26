import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/Layout';
import { AuthProvider, useAuth } from './utils/AuthContext';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Admin from './pages/Admin';
import LessonView from './pages/LessonView';
import { messaging, getToken, onMessage } from './config/firebase';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

export default function App() {
  useEffect(() => {
    const setupNotifications = async () => {
      if (!messaging) return;
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          // Note: VITE_FCM_VAPID_KEY should be added to .env for production
          const vapidKey = import.meta.env.VITE_FCM_VAPID_KEY;
          if (vapidKey) {
            const token = await getToken(messaging, { vapidKey });
            console.log("FCM Token Ready:", token);
            // Here you'd typically save this token to the user's Firestore document
          } else {
            console.log("FCM Vapid Key missing from .env - skipping push registration");
          }
        }
      } catch (error) {
        console.error("Error setting up notifications", error);
      }
    };

    setupNotifications();

    // Listen for foreground messages
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log('Foreground message received:', payload);
        toast(payload.notification.body, {
          icon: '🔔',
          duration: 5000
        });
      });
    }
  }, []);

  return (
    <AuthProvider>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: 'var(--border-radius-pill)',
            fontSize: '14px'
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
          <Route path="/lesson/:id" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
