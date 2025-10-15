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
});
