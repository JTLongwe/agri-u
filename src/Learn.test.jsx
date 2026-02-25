import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Learn from './pages/Learn';
import { BrowserRouter } from 'react-router-dom';

// 1. Mock Storage
vi.mock('./utils/storage', () => ({
    storage: {
        getSavedLessons: vi.fn(() => Promise.resolve([{ id: '1' }]))
    }
}));

// 2. Mock Authentication completely to skip Firebase initialization errors
vi.mock('./utils/AuthContext', () => ({
    useAuth: () => ({
        user: { name: 'Demo User', uid: '12345' }
    })
}));

// 3. Mock Network Status (useNetwork hook)
vi.mock('./utils/useNetwork', () => ({
    useNetwork: () => true // Simulate being online
}));

describe('Learn Library Smoke Test #2', () => {
    it('renders the course library and search bar', () => {
        render(
            <BrowserRouter>
                <Learn />
            </BrowserRouter>
        );

        // Assert library header is present
        expect(screen.getByText(/Library/i)).toBeDefined();

        // Assert the search input rendered
        expect(screen.getByPlaceholderText(/Search topics.../i)).toBeDefined();

        // Assert that at least our category filters are rendered
        expect(screen.getAllByText('All Courses').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Water').length).toBeGreaterThan(0);
    });
});
