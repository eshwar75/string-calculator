import { validateExpression, validateRegexString } from './stringCalculator';
import { describe, it, expect } from 'vitest';

describe('Validate parentheses expression', () => {
	it('should return valid for a correct expression', () => {
		expect(validateExpression('2 + 3 * (4 - 1)')).toBe(true);
	});
	it('should return valid for a incorrect expression', () => {
		expect(validateExpression('2 + 3) * (4 - 1')).toBe(false);
	});
	it('should detect mismatched parentheses', () => {
		expect(validateExpression('2 + 3) * 4')).toBe(false);
	});
	it('Multiply the sum of 4 and 5 by the result of 4 divided by 2 parentheses', () => {
		expect(validateExpression('(4 + 5) * (4 / 2)')).toBe(true);
	});
});

describe('Validate regex expression', () => {
	it('should return true for empty string or only whitespace', () => {
		expect(validateRegexString('')).toBe(false);
		expect(validateRegexString('   ')).toBe(false);
	});
	it('should return false for a valid expression with numbers and operators', () => {
		expect(validateRegexString('4 + 5 - (3 * 2)')).toBe(true);
	});
	it('should if the expression contains invalid special characters', () => {
		expect(validateRegexString('5 + 3 % 2')).toBe(false);
		expect(validateRegexString('7 $ 1')).toBe(false);
	});
	it('should validate complex expression', () => {
		expect(validateRegexString(' ( 12 + 34 ) / 2 - 7 * (3 + 1) ')).toBe(true);
	});
	it('should expression contains invalid letters characters', () => {
		expect(validateRegexString('4 + 5a')).toBe(false);
		expect(validateRegexString('10 & 2')).toBe(false);
		expect(validateRegexString('9 - e + 3 * r')).toBe(false);
	});
	it('should without numbers parentheses and operators be invalid', () => {
		expect(validateRegexString('((()))')).toBe(false);
		expect(validateRegexString('+-')).toBe(false);
		expect(validateRegexString('+ - * /')).toBe(false);
	});
	it('should detect consecutive operators', () => {
		expect(validateRegexString('2 ++ 3')).toBe(false);
		expect(validateRegexString('4 -- 1 ** 2')).toBe(false);
		expect(validateRegexString('5 ** 2 / 4')).toBe(false);
	});
});
