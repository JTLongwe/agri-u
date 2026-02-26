import localforage from 'localforage';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

localforage.config({
    name: 'agri_u_db'
});

const getPrefix = (userId) => userId ? `${userId}_` : 'guest_';

// Helper to push updates to Firestore if the user is logged in
const syncToCloud = async (userId, dataKey, data) => {
    if (!userId) return; // Guests don't get cloud sync yet
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, { [dataKey]: data }, { merge: true });
        console.log(`Cloud sync successful for ${dataKey}`);
    } catch (e) {
        console.error('Cloud sync failed - will retry later', e);
    }
};

export const storage = {
    // Initial fetch from cloud to populate local db on login
    pullFromCloud: async (userId) => {
        if (!userId) return;
        try {
            const userRef = doc(db, 'users', userId);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.saved_lessons) await localforage.setItem(`${userId}_saved_lessons`, data.saved_lessons);
                if (data.user_progress !== undefined) await localforage.setItem(`${userId}_user_progress`, data.user_progress);
                if (data.badges) await localforage.setItem(`${userId}_badges`, data.badges);
            }
        } catch (e) {
            console.error('Failed to pull from cloud', e);
        }
    },

    saveLesson: async (userId, lesson) => {
        try {
            const key = `${getPrefix(userId)}saved_lessons`;
            const saved = await localforage.getItem(key) || [];
            const isAlreadySaved = saved.some(l => l.id === lesson.id);

            if (!isAlreadySaved) {
                saved.push(lesson);
                await localforage.setItem(key, saved);
                await syncToCloud(userId, 'saved_lessons', saved);
            }
            return true;
        } catch (err) {
            console.error('Save failed', err);
            return false;
        }
    },

    getSavedLessons: async (userId) => {
        const key = `${getPrefix(userId)}saved_lessons`;
        return await localforage.getItem(key) || [];
    },

    isLessonSaved: async (userId, id) => {
        const key = `${getPrefix(userId)}saved_lessons`;
        const list = await localforage.getItem(key) || [];
        return list.some(l => l.id === id);
    },

    updateProgress: async (userId, progress) => {
        const key = `${getPrefix(userId)}user_progress`;
        await localforage.setItem(key, progress);
        await syncToCloud(userId, 'user_progress', progress);
    },

    getProgress: async (userId) => {
        const key = `${getPrefix(userId)}user_progress`;
        return (await localforage.getItem(key)) || 0;
    },

    // Badges array sync
    awardBadge: async (userId, badgeId) => {
        const key = `${getPrefix(userId)}badges`;
        const currentBadges = await localforage.getItem(key) || [];
        if (!currentBadges.includes(badgeId)) {
            currentBadges.push(badgeId);
            await localforage.setItem(key, currentBadges);
            await syncToCloud(userId, 'badges', currentBadges);
        }
    },

    getBadges: async (userId) => {
        const key = `${getPrefix(userId)}badges`;
        return (await localforage.getItem(key)) || [];
    }
};
