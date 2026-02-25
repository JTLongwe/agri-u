import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './pages/Home';
import { BrowserRouter } from 'react-router-dom';

// 1. Mock the Offline Storage so we don't try to read real IndexedDB databases in a test environment
vi.mock('./utils/storage', () => ({
    storage: {
        getProgress: vi.fn(() => Promise.resolve(45))
    }
}));

// 2. Mock the Firebase Auth context to simulate a logged-in user instantly
vi.mock('./utils/AuthContext', () => ({
    useAuth: () => ({
        user: { name: 'Test Farmer', uid: '12345' }
    })
}));

describe('Home Dashboard Smoke Test #1', () => {
    it('successfully mounts the UI, welcomes the user, and loads progress', async () => {
        render(
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        );

        // Assert that the page renders the static text properly without crashing
        expect(screen.getByText(/Morning, Farmer!/i)).toBeDefined();

        // Use findBy to wait for the async Promise to resolve the progress bar
        const progressElement = await screen.findByText(/45%/i);
        expect(progressElement).toBeDefined();
    });
});
