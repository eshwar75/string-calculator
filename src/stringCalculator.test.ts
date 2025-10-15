import {
	calculateExpressionDecimal,
	calculateString,
	validateExpression,
	validateRegexString,
} from './stringCalculator';
import { describe, it, expect } from 'vitest';

describe('String Calculator Utility Functions', () => {
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
			expect(
				validateRegexString(' ( 12 + 34 ) / 2 - 7 * (3 + 1) ')
			).toBeTruthy();
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
			expect(calculateExpressionDecimal('4.12 + 1.12)')).toBeNull();
		});
		it('calculates mixed integer and decimal', () => {
			expect(calculateExpressionDecimal('1.15 - 4')).not.toBeNull();
		});
		it('calculates complex decimal expression', () => {
			expect(calculateExpressionDecimal('(14.2 * 7.1) / 0.45')).not.toBeNull();
		});
	});

	describe('calculate Expression function', () => {
		it('calculates valid arithmetic correctly', () => {
			expect(calculateExpressionDecimal('46 + 71')).toBe(117);
			expect(calculateExpressionDecimal('20 - 7')).toBe(13);
			expect(calculateExpressionDecimal('65 * 1')).toBe(65);
			expect(calculateExpressionDecimal('24 / 8')).toBe(3);
		});

		it('handles parentheses precedence correctly', () => {
			expect(calculateExpressionDecimal('46 + 71 * (4 - 1)')).toBe(259);
			expect(calculateExpressionDecimal('(46 + 71) * (4 - 1)')).toBe(351);
		});

		it('returns null for invalid expressions', () => {
			expect(calculateExpressionDecimal('46 + (71 * 1')).toBeNull();
			expect(calculateExpressionDecimal('46 + * 71')).toBeNull();
		});

		it('handles decimal numbers', () => {
			expect(calculateExpressionDecimal('34.7 + 12.2')).toBeCloseTo(46.9);
			expect(calculateExpressionDecimal('20.2 - 7.2')).toBeCloseTo(13);
			expect(calculateExpressionDecimal('65.4 * 1.1')).toBeCloseTo(71.94);
			expect(calculateExpressionDecimal('24.1 / 8.3')).toBeCloseTo(2.9);
		});
	});
	describe('calculate String function', () => {
		it('evaluates simple expressions', () => {
			expect(calculateString('46 + 32')).toBe(78);
			expect(calculateString('18 - 14')).toBe(4);
		});

		it('handles operator precedence correctly', () => {
			expect(calculateString('3 + 5 * 4')).toBe(23);
		});

		it('handles parentheses correctly', () => {
			expect(calculateString('(3 + 5) * 4')).toBe(32);
		});

		it('handles decimals correctly', () => {
			expect(calculateString('2.20 + 6.23')).toBeCloseTo(8.43);
			expect(calculateString('(14.2 * 7.1) / 0.45')).toBeCloseTo(224.04);
		});

		it('evaluates multiple operations left-to-right with precedence', () => {
			expect(calculateString('4 + 3 * 2 - 4 / 2')).toBeCloseTo(8);
		});
	});
});
