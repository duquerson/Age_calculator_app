import { describe, test, expect, beforeEach, vi } from 'vitest';
import { parse } from '@formkit/tempo';
import {
    isValidDate,
    isFutureDate,
    calculateAge,
    validateInput,
    formatDateString,
    initializeElements
} from '../ageCalculator';

// Mock de parse para devolver un Date real
vi.mock('@formkit/tempo', () => ({
    parse: (dateString: string) => new Date(dateString),
    format: vi.fn()
}));

// Mock DOM elements
const mockForm = document.createElement('form') as any;
mockForm.day = document.createElement('input');
mockForm.month = document.createElement('input');
mockForm.year = document.createElement('input');

const mockErrorElements = {
    dayError: document.createElement('span'),
    monthError: document.createElement('span'),
    yearError: document.createElement('span')
};

// Setup before each test
beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
    document.body.appendChild(mockForm);
    Object.values(mockErrorElements).forEach(el => document.body.appendChild(el));

    // Mock getElementById
    vi.spyOn(document, 'getElementById').mockImplementation((id) => {
        if (id === 'age_form') return mockForm;
        if (id === 'dayError') return mockErrorElements.dayError;
        if (id === 'monthError') return mockErrorElements.monthError;
        if (id === 'yearError') return mockErrorElements.yearError;
        return null;
    });

    initializeElements();
});

describe('Validación de fechas', () => {
    test('debería validar una fecha válida', () => {
        expect(isValidDate('1990/01/01', { day: 1, month: 1, year: 1990 })).toBe(true);
    });

    test('debería rechazar una fecha inválida', () => {
        expect(isValidDate('1990/02/31', { day: 31, month: 2, year: 1990 })).toBe(false);
    });

    test('debería rechazar una fecha futura', () => {
        const futureDate = new Date('2099-01-01');
        expect(isFutureDate(futureDate)).toBe(true);
    });
});

describe('Cálculo de edad', () => {
    beforeEach(() => {
        vi.spyOn(global.Date, 'now').mockImplementation(() => new Date('2024-01-01T00:00:00Z').getTime());
    });

    test('debería calcular la edad correctamente', () => {
        const birthDate = '1990/01/01';
        const result = calculateAge(birthDate);
        expect(result).toEqual({
            years: 35,
            months: 5,
            days: 7
        });
    });

    test('debería manejar meses y días negativos', () => {
        const birthDate = '1990/12/31';
        const result = calculateAge(birthDate);
        expect(result).toEqual({
            years: 34,
            months: 5,
            days: 8
        });
    });
});

describe('Validación de inputs', () => {
    test('debería validar un día válido', () => {
        mockForm.day.value = '15';
        const result = validateInput(mockForm.day, 15, {
            min: 1,
            max: 31,
            errorId: 'dayError',
            message: 'Día inválido'
        });
        expect(result).toBe(true);
    });

    test('debería rechazar un día inválido', () => {
        mockForm.day.value = '32';
        const result = validateInput(mockForm.day, 32, {
            min: 1,
            max: 31,
            errorId: 'dayError',
            message: 'Día inválido'
        });
        expect(result).toBe(false);
    });
});

describe('Formateo de fechas', () => {
    test('debería formatear correctamente una fecha', () => {
        const values = {
            day: 1,
            month: 1,
            year: 1990
        };
        const result = formatDateString(values);
        expect(result).toBe('1990-01-01');
    });

    test('debería manejar números de un dígito', () => {
        const values = {
            day: 5,
            month: 5,
            year: 1990
        };
        const result = formatDateString(values);
        expect(result).toBe('1990-05-05');
    });
});