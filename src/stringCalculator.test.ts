import {
	calculateExpression,
	validateExpression,
	validateRegexString,
} from './stringCalculator';
import { describe, it, expect } from 'vitest';

describe('Validate parentheses expression', () => {
	it('should return valid for a correct expression', () => {
		expect(validateExpression('2 + 3 * (4 - 1)')).toBeTruthy();
	});
	it('should return valid for a incorrect expression', () => {
		expect(validateExpression('2 + 3) * (4 - 1')).toBeFalsy();
	});
	it('should detect mismatched parentheses', () => {
		expect(validateExpression('2 + 3) * 4')).toBeFalsy();
	});
	it('Multiply the sum of 4 and 5 by the result of 4 divided by 2 parentheses', () => {
		expect(validateExpression('(4 + 5) * (4 / 2)')).toBeTruthy();
	});
});

describe('Validate regex expression', () => {
	it('should return true for empty string or only whitespace', () => {
		expect(validateRegexString('')).toBeFalsy();
		expect(validateRegexString('   ')).toBeFalsy();
	});
	it('should valid expression with numbers and operators', () => {
		expect(validateRegexString('4 + 5 - (3 * 2)')).toBeTruthy();
	});
	it('should if the expression contains invalid special characters', () => {
		expect(validateRegexString('5 + 3 % 2')).toBeFalsy();
		expect(validateRegexString('7 $ 1')).toBeFalsy();
	});
	it('should validate complex expression', () => {
		expect(validateRegexString(' ( 12 + 34 ) / 2 - 7 * (3 + 1) ')).toBeTruthy();
	});
	it('should expression contains invalid letters characters', () => {
		expect(validateRegexString('4 + 5a')).toBeFalsy();
		expect(validateRegexString('10 & 2')).toBeFalsy();
		expect(validateRegexString('9 - e + 3 * r')).toBeFalsy();
	});
	it('should without numbers parentheses and operators be invalid', () => {
		expect(validateRegexString('((()))')).toBeFalsy();
		expect(validateRegexString('+-')).toBeFalsy();
		expect(validateRegexString('+ - * /')).toBeFalsy();
	});
	it('should detect consecutive two operators at once', () => {
		expect(validateRegexString('5 ++ 2')).toBeFalsy();
		expect(validateRegexString('1 -- 8 ** 3')).toBeFalsy();
		expect(validateRegexString('5 ** 2 / 4')).toBeFalsy();
	});
	it('calculates decimal addition correctly', () => {
		expect(calculateExpression('4.12 + 1.12)')).toBeNull();
	});
	it('calculates mixed integer and decimal', () => {
		expect(calculateExpression('1.15 - 4')).not.toBeNull();
	});
	it('calculates complex decimal expression', () => {
		expect(calculateExpression('(14.2 * 7.1) / 0.45')).not.toBeNull();
	});
});
