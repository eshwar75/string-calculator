import * as calculatorUtils from './stringCalculator';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import {
	invalidCharRegex,
	numberRegex,
	operatorsRegexValid,
	regexConsecutiveOperators,
} from './stringCalculator';

vi.spyOn(calculatorUtils, 'validateExpression').mockImplementation(
	(exp: string) => {
		const validExpressions = [
			'2 + 3',
			'5 * 4',
			'(4 + 5) * (4 / 2)',
			'(2 + 3) * (4 - 1)',
			'(14.8768982 * 7.1) / (0.45 + 3.3232245667) + (21.34 - 11.6947368)',
		];
		return validExpressions.includes(exp);
	}
);

vi.spyOn(calculatorUtils, 'validateRegexString').mockImplementation(
	(exp: string) => {
		return invalidCharRegex.test(exp);
	}
);

vi.spyOn(calculatorUtils, 'validateRegexString').mockImplementation(
	(exp: string) => {
		return numberRegex.test(exp);
	}
);

vi.spyOn(calculatorUtils, 'validateRegexString').mockImplementation(
	(exp: string) => {
		return operatorsRegexValid.test(exp);
	}
);

vi.spyOn(calculatorUtils, 'validateRegexString').mockImplementation(
	(exp: string) => {
		return regexConsecutiveOperators.test(exp);
	}
);

vi.spyOn(calculatorUtils, 'calculateString').mockImplementation(
	(exp: string) => {
		if (exp === '2 + 3') return 5;
		if (exp === '5 * 4') return 20;
		if (exp === '(4 + 5) * (4 / 2)') return 18;
		if (exp === '(2 + 3) * (4 - 1)') return 15;
		if (
			exp ===
			'(14.8768982 * 7.1) / (0.45 + 3.3232245667) + (21.34 - 11.6947368)'
		)
			return 37.84;
		return null;
	}
);

vi.spyOn(calculatorUtils, 'validateRegexString').mockImplementation(
	(exp: string) => {
		if (exp === '2 ++ 3') return false;
		return true;
	}
);

describe('App Component', () => {
	it('renders the basic UI correctly', () => {
		render(<App />);
		expect(screen.getByText('String Calculator')).toBeInTheDocument();
		expect(screen.getByPlaceholderText(/enter here/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /calculate/i })
		).toBeInTheDocument();
	});
	it('initially displays no warnings and results', () => {
		render(<App />);
		expect(screen.queryByRole('alert')).toBeNull();
		expect(screen.queryByText(/Result:/)).toBeNull();
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
			'Please enter a valid numbers with operators(+, -, *, /)'
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

	it('shows warning for invalid regex expression', () => {
		const validateRegexStringMock = vi.spyOn(
			calculatorUtils,
			'validateRegexString'
		);
		validateRegexStringMock.mockReturnValueOnce(false);
		const calculateExpressionDecimalMock = vi.spyOn(
			calculatorUtils,
			'calculateExpressionDecimal'
		);
		calculateExpressionDecimalMock.mockReturnValueOnce(null);

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

	it('handles decimals correctly with parentheses and operators', () => {
		render(<App />);
		const textarea = screen.getByPlaceholderText(/enter here/i);
		const button = screen.getByRole('button', { name: /calculate/i });

		fireEvent.change(textarea, {
			target: {
				value:
					'(14.8768982 * 7.1) / (0.45 + 3.3232245667) + (21.34 - 11.6947368)',
			},
		});
		fireEvent.click(button);

		expect(screen.getByText(/Result:/i)).toHaveTextContent('37.84');
		expect(screen.queryByText(/Result:/)).not.toBeNull();
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('handles decimals and numbers correctly with parentheses and operators', () => {
		render(<App />);
		const textarea = screen.getByPlaceholderText(/enter here/i);
		const button = screen.getByRole('button', { name: /calculate/i });

		fireEvent.change(textarea, {
			target: {
				value:
					'(14.8768982 * 7.1) / (0.45 + 3.3232245667) + (21.34 - 11.6947368)',
			},
		});
		fireEvent.click(button);
		expect(screen.getByText(/Result:/i)).toHaveTextContent('37.84');

		fireEvent.change(textarea, { target: { value: '' } });
		expect(textarea.value).toBe('');
		expect(screen.queryByRole('alert')).toBeNull();
		expect(screen.queryByText(/Result:/)).toBeNull();

		fireEvent.change(textarea, {
			target: {
				value: '(2 + 3) * (4 - 1)',
			},
		});
		fireEvent.click(button);
		expect(screen.getByText(/Result:/i)).toHaveTextContent('15');
		expect(screen.queryByRole('alert')).toBeNull();
	});
});
