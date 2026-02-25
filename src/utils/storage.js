import localforage from 'localforage';

localforage.config({
    name: 'agri_u_db'
});

const getPrefix = (userId) => userId ? `${userId}_` : 'guest_';

export const storage = {
    // Save specific lesson by ID
    saveLesson: async (userId, lesson) => {
        try {
            const key = `${getPrefix(userId)}saved_lessons`;
            const saved = await localforage.getItem(key) || [];
            const isAlreadySaved = saved.some(l => l.id === lesson.id);

            if (!isAlreadySaved) {
                saved.push(lesson);
                await localforage.setItem(key, saved);
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

    // Save Progress (0-100)
    updateProgress: async (userId, progress) => {
        const key = `${getPrefix(userId)}user_progress`;
        await localforage.setItem(key, progress);
    },

    getProgress: async (userId) => {
        const key = `${getPrefix(userId)}user_progress`;
        return await localforage.getItem(key) || 0;
    }
};
