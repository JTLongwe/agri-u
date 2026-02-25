import localforage from 'localforage';

localforage.config({
    name: 'agri_u_db'
});

export const storage = {
    // Save specific lesson by ID
    saveLesson: async (lesson) => {
        try {
            const saved = await localforage.getItem('saved_lessons') || [];
            const isAlreadySaved = saved.some(l => l.id === lesson.id);

            if (!isAlreadySaved) {
                saved.push(lesson);
                await localforage.setItem('saved_lessons', saved);
            }
            return true;
        } catch (err) {
            console.error('Save failed', err);
            return false;
        }
    },

    getSavedLessons: async () => {
        return await localforage.getItem('saved_lessons') || [];
    },

    isLessonSaved: async (id) => {
        const list = await localforage.getItem('saved_lessons') || [];
        return list.some(l => l.id === id);
    },

    // Save Progress (0-100)
    updateProgress: async (progress) => {
        await localforage.setItem('user_progress', progress);
    },

    getProgress: async () => {
        return await localforage.getItem('user_progress') || 0;
    }
};
