import * as calculatorUtils from './stringCalculator';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
	it('Initial renders', () => {
		render(<App />);
		expect(screen.getByText('String Calculator')).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/enter here/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /calculate/i })
		).toBeInTheDocument();
	});
	it('renders the form and textarea correctly', () => {
		render(<App />);
		const heading = screen.getByText('String Calculator');
		const textarea = screen.getByPlaceholderText(/enter here/i);

		expect(heading).toBeInTheDocument();
		expect(textarea).toBeInTheDocument();
		expect(textarea).toHaveAttribute('aria-required', 'true');
		expect(textarea).toHaveAttribute('required');
	});

	it('should warning for invalid expression', () => {
		render(<App />);
		const textarea = screen.getByPlaceholderText(/enter here/i);
		fireEvent.change(textarea, { target: { value: '2 ++ 3' } });

		const button = screen.getByRole('button', { name: /calculate/i });
		fireEvent.click(button);

		expect(screen.getByRole('alert')).toHaveTextContent(
			'Please enter a valid numbers with operators(+, -, *, /) eg: 1 + 4 + 18'
		);
	});

	it('renders textarea with correct attributes', () => {
		render(<App />);
		const textarea = screen.getByPlaceholderText(/enter here/i);
		expect(textarea).toBeInTheDocument();
		expect(textarea).toHaveAttribute('aria-required', 'true');
		expect(textarea).toHaveAttribute('required');
		expect(screen.queryByRole('alert')).toBeNull();
		expect(screen.queryByText(/Result:/)).toBeNull();
	});

	it('allows user to type & updates value', () => {
		render(<App />);
		const textarea = screen.getByPlaceholderText(
			/enter here/i
		) as HTMLTextAreaElement;

		fireEvent.change(textarea, { target: { value: '2 + 3' } });
		expect(textarea.value).toBe('2 + 3');
	});

	it('shows warning for invalid parentheses', () => {
		vi.spyOn(calculatorUtils, 'validateExpression').mockReturnValue(false);

		render(<App />);
		const textarea = screen.getByPlaceholderText(/enter here/i);
		fireEvent.change(textarea, { target: { value: '2 + (3' } });

		const button = screen.getByRole('button', { name: /calculate/i });
		fireEvent.click(button);

		expect(screen.getByRole('alert')).toHaveTextContent('Invalid Parentheses');
	});

	it('calculates & displays result for valid input', () => {
		vi.spyOn(calculatorUtils, 'validateExpression').mockReturnValue(true);

		render(<App />);
		const textarea = screen.getByPlaceholderText(/enter here/i);
		fireEvent.change(textarea, { target: { value: '(2 + 3) * (4 - 1)' } });

		const button = screen.getByRole('button', { name: /calculate/i });
		fireEvent.click(button);

		expect(screen.queryByRole('alert')).toBeNull();
		expect(screen.getByText('Result: 15')).toBeInTheDocument();
	});

	it('clears result & warning when input is cleared', () => {
		render(<App />);
		const textarea = screen.getByPlaceholderText(/enter here/i);
		const button = screen.getByRole('button', { name: /calculate/i });

		fireEvent.change(textarea, { target: { value: '2 + 3' } });
		fireEvent.click(button);
		expect(screen.getByText('Result: 5')).toBeInTheDocument();

		fireEvent.change(textarea, { target: { value: '' } });
		expect(screen.queryByText(/Result:/)).toBeNull();
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('clears value and resets warning/result when emptied', () => {
		render(<App />);
		const textarea = screen.getByPlaceholderText(
			/enter here/i
		) as HTMLTextAreaElement;

		fireEvent.change(textarea, { target: { value: '2 + 3' } });
		expect(textarea.value).toBe('2 + 3');
		fireEvent.change(textarea, { target: { value: '' } });
		expect(textarea.value).toBe('');
		expect(screen.queryByRole('alert')).toBeNull();
		expect(screen.queryByText(/Result:/)).toBeNull();
	});

	// mocks testing
	it('shows warning for invalid regex expression', () => {
		const validateRegexStringMock = vi.spyOn(
			calculatorUtils,
			'validateRegexString'
		);
		validateRegexStringMock.mockReturnValueOnce(false);
		const calculateExpressionMock = vi.spyOn(
			calculatorUtils,
			'calculateExpression'
		);
		calculateExpressionMock.mockReturnValueOnce(null);

		render(<App />);
		const textarea = screen.getByPlaceholderText(/enter here/i);
		const button = screen.getByRole('button', { name: /calculate/i });

		fireEvent.change(textarea, { target: { value: '+++' } });
		fireEvent.click(button);

		const alert = screen.getByRole('alert');
		expect(alert).toHaveTextContent(
			'Please enter a valid numbers with operators(+, -, *, /)'
		);
	});

	it('shows warning for invalid parentheses', () => {
		vi.spyOn(calculatorUtils, 'validateExpression').mockReturnValueOnce(false);

		render(<App />);
		const textarea = screen.getByPlaceholderText(/enter here/i);
		const button = screen.getByRole('button', { name: /calculate/i });

		fireEvent.change(textarea, { target: { value: '(2 + 3' } });
		fireEvent.click(button);

		expect(screen.getByRole('alert')).toHaveTextContent('Invalid Parentheses');
	});

	it('calculates valid input correctly', () => {
		vi.spyOn(calculatorUtils, 'calculateString').mockReturnValueOnce(6);

		render(<App />);
		const textarea = screen.getByPlaceholderText(/enter here/i);
		const button = screen.getByRole('button', { name: /calculate/i });

		fireEvent.change(textarea, { target: { value: '(3 + 4) - (4/2) + 1' } });
		fireEvent.click(button);

		expect(screen.getByText(/Result:/i)).toHaveTextContent('6');
	});

	it('handles decimal number input correctly', () => {
		vi.spyOn(calculatorUtils, 'calculateString').mockReturnValueOnce(5.24);

		render(<App />);
		const textarea = screen.getByPlaceholderText(/enter here/i);
		const button = screen.getByRole('button', { name: /calculate/i });

		fireEvent.change(textarea, { target: { value: '4.12 + 1.12' } });
		fireEvent.click(button);

		const result = screen.getByText(/Result:/i);
		expect(result).toHaveTextContent('5.24');
	});

	it('initially displays no warnings and results', () => {
		render(<App />);
		expect(screen.queryByRole('alert')).toBeNull();
		expect(screen.queryByText(/Result:/)).toBeNull();
	});
});
