importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
const firebaseConfig = {
    apiKey: "AIzaSyB7nCKM8h5EAv9oHXK9ja_YqnmBSsuJ7x8",
    authDomain: "agri-u.firebaseapp.com",
    projectId: "agri-u",
    storageBucket: "agri-u.firebasestorage.app",
    messagingSenderId: "207554586827",
    appId: "1:207554586827:web:948736872ea70fbe92934e",
    measurementId: "G-DV6BJ8875K"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/pwa-192x192.png' // Use the app's PWA icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
