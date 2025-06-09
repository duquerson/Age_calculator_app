import { parse } from "@formkit/tempo";
import { CountUp } from 'countup.js';

// Types
interface FormElements extends HTMLFormElement {
	day: HTMLInputElement;
	month: HTMLInputElement;
	year: HTMLInputElement;
}

interface ErrorElements {
	dayError: HTMLElement;
	monthError: HTMLElement;
	yearError: HTMLElement;
}

interface DateValues {
	day: number;
	month: number;
	year: number;
}

interface AgeResult {
	years: number;
	months: number;
	days: number;
}

interface ValidationConfig {
	min: number;
	max: number;
	errorId: keyof ErrorElements;
	message: string;
}

// Constants
let FORM: FormElements;
let ERROR_ELEMENTS: ErrorElements;

// Initialize DOM elements
function initializeElements() {
	FORM = document.getElementById("age_form") as FormElements;
	ERROR_ELEMENTS = {
		dayError: document.getElementById("dayError") as HTMLElement,
		monthError: document.getElementById("monthError") as HTMLElement,
		yearError: document.getElementById("yearError") as HTMLElement
	};
}

const VALIDATION_RULES: Record<keyof DateValues, ValidationConfig> = {
	day: { min: 1, max: 31, errorId: 'dayError', message: 'Día inválido' },
	month: { min: 1, max: 12, errorId: 'monthError', message: 'Mes inválido' },
	year: { min: 1900, max: new Date().getFullYear(), errorId: 'yearError', message: 'Año inválido' }
};

const COUNT_UP_OPTIONS = {
	duration: 1.5,
	useEasing: true,
	useGrouping: false,
	separator: '',
	decimal: '',
} as const;

// Utility Functions
function setInputStyle(input: HTMLInputElement, isValid: boolean): void {
	if (isValid) {
		input.classList.remove('border-red-300');
		input.classList.add('border-gray-300');
	} else {
		input.classList.remove('border-gray-300');
		input.classList.add('border-red-300');
	}
}

function clearError(element: HTMLElement): void {
	element.textContent = "";
}

function setError(element: HTMLElement, message: string): void {
	element.textContent = message;
}

// Validation Functions
function resetErrors(): void {
	Object.values(ERROR_ELEMENTS).forEach(clearError);
	Object.values(FORM).forEach((input) => {
		if (input instanceof HTMLInputElement) {
			setInputStyle(input, true);
		}
	});
}

function validateInput(input: HTMLInputElement, value: number, rule: ValidationConfig): boolean {
	const errorElement = ERROR_ELEMENTS[rule.errorId];

	if (!value || value < rule.min || value > rule.max) {
		setError(errorElement, rule.message);
		setInputStyle(input, false);
		return false;
	}

	clearError(errorElement);
	setInputStyle(input, true);
	return true;
}

function validateDateString(dateString: string): boolean {
	const birthDate = parse(dateString, 'YYYY-MM-DD');

	if (isNaN(birthDate.getTime())) {
		setError(ERROR_ELEMENTS.dayError, "Fecha inválida");
		setInputStyle(FORM.day, false);
		return false;
	}

	const [year, month, day] = dateString.split('-').map(Number);
	if (birthDate.getFullYear() !== year ||
		birthDate.getMonth() + 1 !== month ||
		birthDate.getDate() !== day) {
		setError(ERROR_ELEMENTS.dayError, "Fecha inválida");
		setInputStyle(FORM.day, false);
		return false;
	}

	const today = new Date();
	if (birthDate > today) {
		setError(ERROR_ELEMENTS.yearError, "La fecha no puede ser en el futuro");
		setInputStyle(FORM.year, false);
		return false;
	}

	return true;
}

// Helper Functions
function getFormValues(): DateValues {
	return {
		day: parseInt(FORM.day.value),
		month: parseInt(FORM.month.value),
		year: parseInt(FORM.year.value)
	};
}

function areAllFieldsFilled(values: DateValues): boolean {
	return Boolean(values.day && values.month && values.year);
}

function formatDateString(values: DateValues): string {
	return `${values.year}-${values.month.toString().padStart(2, '0')}-${values.day.toString().padStart(2, '0')}`;
}

// Age Calculation Functions
function calculateAge(birthDate: string | Date): AgeResult {
	const birthDateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	let years = today.getFullYear() - birthDateObj.getFullYear();
	let months = today.getMonth() - birthDateObj.getMonth();
	let days = today.getDate() - birthDateObj.getDate();

	if (days < 0) {
		months--;
		const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
		days += lastMonth.getDate();
	}

	if (months < 0) {
		years--;
		months += 12;
	}

	return { years, months, days };
}

// Animation Functions
function animateNumber(elementId: string, finalValue: number): void {
	const element = document.getElementById(elementId);
	if (!element) return;

	const countUp = new CountUp(elementId, finalValue, COUNT_UP_OPTIONS);
	if (!countUp.error) {
		countUp.start();
	} else {
		console.error(countUp.error);
	}
}

// Event Handlers
function handleInputChange(e: Event): void {
	const input = e.target as HTMLInputElement;
	const value = parseInt(input.value);
	const field = input.id as keyof DateValues;

	// Si el campo está vacío, limpiar errores
	if (!input.value) {
		setInputStyle(input, true);
		clearError(ERROR_ELEMENTS[VALIDATION_RULES[field].errorId]);
		return;
	}

	// Validar el rango del campo individual
	validateInput(input, value, VALIDATION_RULES[field]);

	// Solo validar la fecha completa si el valor es numérico
	if (!isNaN(value)) {
		validateDateInRealTime();
	}
}

function handleSubmit(e: Event): void {
	e.preventDefault();
	const values = getFormValues();
	resetErrors();

	if (!areAllFieldsFilled(values)) {
		handleEmptyFields(values);
		return;
	}

	if (!validateDateValues(values)) return;

	const dateString = formatDateString(values);
	const birthDate = parse(dateString, 'YYYY-MM-DD');
	const age = calculateAge(birthDate);

	animateNumber("years", age.years);
	animateNumber("months", age.months);
	animateNumber("days", age.days);
}

function handleEmptyFields(values: DateValues): void {
	if (!values.day) {
		setInputStyle(FORM.day, false);
		setError(ERROR_ELEMENTS.dayError, "Este campo es requerido");
	}
	if (!values.month) {
		setInputStyle(FORM.month, false);
		setError(ERROR_ELEMENTS.monthError, "Este campo es requerido");
	}
	if (!values.year) {
		setInputStyle(FORM.year, false);
		setError(ERROR_ELEMENTS.yearError, "Este campo es requerido");
	}
}

function validateDateValues(values: DateValues): boolean {
	const validations = Object.entries(VALIDATION_RULES).map(([field, rule]) => {
		const input = FORM[field as keyof FormElements] as HTMLInputElement;
		return validateInput(input, values[field as keyof DateValues], rule);
	});

	if (!validations.every(Boolean)) return false;

	const dateString = formatDateString(values);
	return validateDateString(dateString);
}

function validateDateInRealTime(): void {
	const values = getFormValues();

	// Verificar que todos los campos tengan valores numéricos válidos
	if (!areAllFieldsFilled(values) ||
		isNaN(values.day) ||
		isNaN(values.month) ||
		isNaN(values.year)) {
		return;
	}

	// Verificar que los valores estén dentro de los rangos válidos
	if (values.day < 1 || values.day > 31 ||
		values.month < 1 || values.month > 12 ||
		values.year < 1900 || values.year > new Date().getFullYear()) {
		return;
	}

	const dateString = formatDateString(values);
	const birthDate = parse(dateString, 'YYYY-MM-DD');

	if (!isValidDate(birthDate, values)) {
		setError(ERROR_ELEMENTS.dayError, "Fecha inválida");
		setInputStyle(FORM.day, false);
		return;
	}

	if (isFutureDate(birthDate)) {
		setError(ERROR_ELEMENTS.yearError, "La fecha no puede ser en el futuro");
		setInputStyle(FORM.year, false);
		return;
	}

	clearAllErrors();
}

function isValidDate(date: string | Date, values: DateValues): boolean {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	return !isNaN(dateObj.getTime()) &&
		dateObj.getFullYear() === values.year &&
		dateObj.getMonth() + 1 === values.month &&
		dateObj.getDate() === values.day;
}

function isFutureDate(date: string | Date): boolean {
	const dateObj = typeof date === 'string' ? new Date(date) : date;
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	return dateObj > today;
}

function clearAllErrors(): void {
	Object.values(ERROR_ELEMENTS).forEach(clearError);
	Object.values(FORM).forEach((input) => {
		if (input instanceof HTMLInputElement) {
			setInputStyle(input, true);
		}
	});
}

// Inicializar listeners solo cuando el DOM esté disponible
function setupFormListeners() {
	if (!FORM) return;
	FORM.addEventListener("submit", handleSubmit);
	FORM.day.addEventListener("input", handleInputChange);
	FORM.month.addEventListener("input", handleInputChange);
	FORM.year.addEventListener("input", handleInputChange);
}

// Llamar automáticamente solo si estamos en un navegador real
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
	initializeElements();
	setupFormListeners();
}

// Exportar funciones para testing
export {
	isValidDate,
	isFutureDate,
	calculateAge,
	validateInput,
	formatDateString,
	initializeElements,
	setupFormListeners
};
