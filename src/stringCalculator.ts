/* eslint-disable no-useless-escape */
export const invalidCharRegex = /[^0-9+\-*()/\s]/;
export const regexConsecutiveOperators = /[+\-*\/]{2,}/;
export const numberRegex = /[0-9]/;
export const operatorsRegexValid = /\d+(\.\d+)?|\+|\-|\*|\/|\(|\)/g;
export function validateExpression(string: string): boolean {
	let balance = 0;
	for (const ch of string) {
		if (ch === '(') {
			balance++;
		} else if (ch === ')') {
			balance--;
		}
		if (balance < 0) {
			return false;
		}
	}
	return balance === 0;
}

export function validateRegexString(stringCalculator: string): boolean {
	const withoutDecimals = stringCalculator
		.replace(/\s+/g, '')
		.replace(/\d+(\.\d+)?/g, 'N');

	if (
		invalidCharRegex.test(stringCalculator) ||
		!numberRegex.test(stringCalculator) ||
		regexConsecutiveOperators.test(withoutDecimals)
	) {
		return false;
	}

	return true;
}

export function calculateExpressionDecimal(stringValue: string): number | null {
	if (!validateExpression(stringValue)) return null;
	try {
		return Function(`"use strict"; return (${stringValue})`)();
	} catch {
		return null;
	}
}

export function calculateString(expression: string) {
	const expressionArr: string[] = expression.match(operatorsRegexValid) || [];
	const valuesAndOperator: string[] = expressionFix(expressionArr);
	return calculateValue(valuesAndOperator) || null;
}

function expressionFix(expressionValues: string[]) {
	const output: string[] = [];
	const operators: string[] = [];
	const precedence: { [key: string]: number } = {
		'+': 1,
		'-': 1,
		'*': 2,
		'/': 2,
	};

	for (const expressionValue of expressionValues) {
		if (!Number.isNaN(Number(expressionValue))) {
			output.push(expressionValue);
		} else if (expressionValue in precedence) {
			while (
				operators.length &&
				precedence[operators[operators.length - 1]] >=
					precedence[expressionValue]
			) {
				const operator = operators.pop();
				if (operator) {
					output.push(operator);
				}
			}
			operators.push(expressionValue);
		} else if (expressionValue === '(') {
			operators.push(expressionValue);
		} else if (expressionValue === ')') {
			while (operators.length && operators[operators.length - 1] !== '(') {
				const operator = operators.pop();
				if (operator) {
					output.push(operator);
				}
			}
			operators.pop();
		}
	}

	while (operators.length) {
		const operator = operators.pop();
		if (operator) {
			output.push(operator);
		}
	}

	return output;
}

function calculateValue(operatorValues: string[]) {
	const calculateValues: number[] = [];

	for (const token of operatorValues) {
		if (!isNaN(Number(token))) {
			calculateValues.push(Number(token));
		} else {
			const b = calculateValues.pop();
			const a = calculateValues.pop();
			switch (token) {
				case '+':
					if (a !== undefined && b !== undefined) {
						calculateValues.push(a + b);
					}
					break;
				case '-':
					if (a !== undefined && b !== undefined) {
						calculateValues.push(a - b);
					}
					break;
				case '*':
					if (a !== undefined && b !== undefined) {
						calculateValues.push(a * b);
					}
					break;
				case '/':
					if (a !== undefined && b !== undefined) {
						calculateValues.push(a / b);
					}
					break;
			}
		}
	}

	if (calculateValues.length !== 1) {
		return null;
	}
	return Number.isInteger(calculateValues[0])
		? calculateValues[0]
		: parseFloat(calculateValues[0].toFixed(2));
}
