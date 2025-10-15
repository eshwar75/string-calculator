/* eslint-disable no-useless-escape */
const invalidCharRegex = /[^0-9+\-*()/\s]/;
const regexConsecutiveOperators = /[+\-*\/]{2,}/;
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
	if (invalidCharRegex.test(stringCalculator)) return false;
	// const hasNumber = /[0-9]/.test(stringCalculator);
	if (!/[0-9]/.test(stringCalculator)) return false;
	if (regexConsecutiveOperators.test(stringCalculator.replace(/\s+/g, '')))
		return false;

	return true;
}
