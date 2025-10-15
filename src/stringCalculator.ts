/* eslint-disable no-useless-escape */
const invalidCharRegex = /[^0-9+\-*()/\s]/;
const regexConsecutiveOperators = /[+\-*\/]{2,}/;
const numberRegex = /[0-9]/;
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

export function calculateExpression(stringValue: string): number | null {
	if (!validateExpression(stringValue)) return null;
	try {
		return Function(`"use strict"; return (${stringValue})`)();
	} catch {
		return null;
	}
}
