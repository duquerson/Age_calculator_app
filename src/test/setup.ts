import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock DOM elements
const mockDayInput = document.createElement('input');
const mockMonthInput = document.createElement('input');
const mockYearInput = document.createElement('input');

const mockDayError = document.createElement('span');
const mockMonthError = document.createElement('span');
const mockYearError = document.createElement('span');

// Mock @formkit/tempo
vi.mock('@formkit/tempo', () => ({
    parse: vi.fn(),
    format: vi.fn()
}));

// Expose mocks globally
(global as any).mockDayInput = mockDayInput;
(global as any).mockMonthInput = mockMonthInput;
(global as any).mockYearInput = mockYearInput;
(global as any).mockDayError = mockDayError;
(global as any).mockMonthError = mockMonthError;
(global as any).mockYearError = mockYearError;