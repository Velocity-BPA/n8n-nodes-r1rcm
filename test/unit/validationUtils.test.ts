/* Copyright (c) Velocity BPA, LLC. Licensed under the Business Source License 1.1. See LICENSE file for details. Commercial use requires a separate license from Velocity BPA. */

/**
 * Unit Tests for Validation Utilities
 * 
 * Tests NPI validation, date validation, and healthcare-specific validators.
 */

// Mock n8n-workflow for isolated testing
jest.mock('n8n-workflow', () => ({
	NodeApiError: class extends Error {
		constructor(node: any, error: any) {
			super(error.message);
		}
	},
}));

describe('Validation Utilities', () => {
	describe('NPI Validation', () => {
		/**
		 * Validate NPI using Luhn algorithm
		 * NPI uses the Luhn algorithm with a prefix of 80840
		 */
		function validateNpiLuhn(npi: string): boolean {
			if (!/^\d{10}$/.test(npi)) return false;
			
			const prefixedNpi = '80840' + npi;
			let sum = 0;
			let alternate = false;
			
			for (let i = prefixedNpi.length - 1; i >= 0; i--) {
				let digit = parseInt(prefixedNpi[i], 10);
				if (alternate) {
					digit *= 2;
					if (digit > 9) {
						digit = (digit % 10) + 1;
					}
				}
				sum += digit;
				alternate = !alternate;
			}
			
			return sum % 10 === 0;
		}

		test('should validate correct NPI', () => {
			// Valid NPIs pass Luhn check with 80840 prefix
			expect(validateNpiLuhn('1234567893')).toBe(true);
			expect(validateNpiLuhn('1497758544')).toBe(true);
		});

		test('should reject invalid NPI (wrong check digit)', () => {
			expect(validateNpiLuhn('1234567890')).toBe(false);
			expect(validateNpiLuhn('1234567891')).toBe(false);
		});

		test('should reject NPI with wrong length', () => {
			expect(validateNpiLuhn('123456789')).toBe(false);
			expect(validateNpiLuhn('12345678901')).toBe(false);
		});

		test('should reject NPI with non-numeric characters', () => {
			expect(validateNpiLuhn('123456789A')).toBe(false);
			expect(validateNpiLuhn('ABCDEFGHIJ')).toBe(false);
		});
	});

	describe('Tax ID Validation', () => {
		function validateEin(ein: string): boolean {
			const cleaned = ein.replace(/[-\s]/g, '');
			return /^\d{9}$/.test(cleaned);
		}

		function validateSsn(ssn: string): boolean {
			const cleaned = ssn.replace(/[-\s]/g, '');
			if (!/^\d{9}$/.test(cleaned)) return false;
			
			// SSNs cannot start with 000, 666, or 9xx
			const area = parseInt(cleaned.substring(0, 3), 10);
			if (area === 0 || area === 666 || area >= 900) return false;
			
			// Group and serial cannot be all zeros
			const group = cleaned.substring(3, 5);
			const serial = cleaned.substring(5);
			if (group === '00' || serial === '0000') return false;
			
			return true;
		}

		test('should validate correct EIN', () => {
			expect(validateEin('12-3456789')).toBe(true);
			expect(validateEin('123456789')).toBe(true);
		});

		test('should reject invalid EIN', () => {
			expect(validateEin('12-345678')).toBe(false);
			expect(validateEin('12-34567890')).toBe(false);
		});

		test('should validate correct SSN', () => {
			expect(validateSsn('123-45-6789')).toBe(true);
			expect(validateSsn('123456789')).toBe(true);
		});

		test('should reject invalid SSN (invalid area)', () => {
			expect(validateSsn('000-12-3456')).toBe(false);
			expect(validateSsn('666-12-3456')).toBe(false);
			expect(validateSsn('900-12-3456')).toBe(false);
		});

		test('should reject invalid SSN (all zeros in group/serial)', () => {
			expect(validateSsn('123-00-6789')).toBe(false);
			expect(validateSsn('123-45-0000')).toBe(false);
		});
	});

	describe('Date Validation', () => {
		function isValidDate(dateString: string): boolean {
			const date = new Date(dateString);
			return !isNaN(date.getTime());
		}

		function isValidDateRange(startDate: string, endDate: string): boolean {
			const start = new Date(startDate);
			const end = new Date(endDate);
			return start <= end;
		}

		test('should validate correct date formats', () => {
			expect(isValidDate('2024-01-15')).toBe(true);
			expect(isValidDate('2024-01-15T10:30:00Z')).toBe(true);
		});

		test('should reject invalid dates', () => {
			expect(isValidDate('invalid-date')).toBe(false);
			expect(isValidDate('')).toBe(false);
		});

		test('should validate date ranges', () => {
			expect(isValidDateRange('2024-01-01', '2024-12-31')).toBe(true);
			expect(isValidDateRange('2024-01-01', '2024-01-01')).toBe(true);
		});

		test('should reject invalid date ranges', () => {
			expect(isValidDateRange('2024-12-31', '2024-01-01')).toBe(false);
		});
	});

	describe('Healthcare Code Validation', () => {
		function isValidIcd10(code: string): boolean {
			// ICD-10-CM: A00-Z99 followed by 1-7 alphanumeric characters
			return /^[A-TV-Z]\d{2}(\.\d{1,4})?$/.test(code.toUpperCase());
		}

		function isValidCpt(code: string): boolean {
			// CPT codes are 5 digits, optionally with modifiers
			return /^\d{5}$/.test(code);
		}

		function isValidHcpcs(code: string): boolean {
			// HCPCS Level II: Letter followed by 4 digits
			return /^[A-V]\d{4}$/.test(code.toUpperCase());
		}

		test('should validate ICD-10 codes', () => {
			expect(isValidIcd10('A01')).toBe(true);
			expect(isValidIcd10('E11.9')).toBe(true);
			expect(isValidIcd10('Z23')).toBe(true);
		});

		test('should reject invalid ICD-10 codes', () => {
			expect(isValidIcd10('123')).toBe(false);
			expect(isValidIcd10('ABC')).toBe(false);
		});

		test('should validate CPT codes', () => {
			expect(isValidCpt('99213')).toBe(true);
			expect(isValidCpt('00100')).toBe(true);
		});

		test('should reject invalid CPT codes', () => {
			expect(isValidCpt('9921')).toBe(false);
			expect(isValidCpt('99213A')).toBe(false);
		});

		test('should validate HCPCS codes', () => {
			expect(isValidHcpcs('A0100')).toBe(true);
			expect(isValidHcpcs('J3490')).toBe(true);
		});

		test('should reject invalid HCPCS codes', () => {
			expect(isValidHcpcs('12345')).toBe(false);
			expect(isValidHcpcs('AA123')).toBe(false);
		});
	});

	describe('Phone Number Validation', () => {
		function validatePhoneNumber(phone: string): { valid: boolean; formatted: string } {
			const cleaned = phone.replace(/\D/g, '');
			
			if (cleaned.length === 10) {
				return {
					valid: true,
					formatted: `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`,
				};
			} else if (cleaned.length === 11 && cleaned[0] === '1') {
				const number = cleaned.slice(1);
				return {
					valid: true,
					formatted: `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`,
				};
			}
			
			return { valid: false, formatted: phone };
		}

		test('should validate and format 10-digit phone numbers', () => {
			const result = validatePhoneNumber('5551234567');
			expect(result.valid).toBe(true);
			expect(result.formatted).toBe('(555) 123-4567');
		});

		test('should validate phone with country code', () => {
			const result = validatePhoneNumber('15551234567');
			expect(result.valid).toBe(true);
			expect(result.formatted).toBe('(555) 123-4567');
		});

		test('should handle formatted input', () => {
			const result = validatePhoneNumber('(555) 123-4567');
			expect(result.valid).toBe(true);
		});

		test('should reject invalid phone numbers', () => {
			expect(validatePhoneNumber('12345').valid).toBe(false);
			expect(validatePhoneNumber('123456789012').valid).toBe(false);
		});
	});

	describe('Amount Validation', () => {
		function isValidCurrency(amount: number): boolean {
			// Currency should be non-negative with max 2 decimal places
			if (amount < 0) return false;
			const decimalPlaces = (amount.toString().split('.')[1] || '').length;
			return decimalPlaces <= 2;
		}

		test('should validate currency amounts', () => {
			expect(isValidCurrency(100.00)).toBe(true);
			expect(isValidCurrency(0)).toBe(true);
			expect(isValidCurrency(99.99)).toBe(true);
		});

		test('should reject negative amounts', () => {
			expect(isValidCurrency(-100)).toBe(false);
		});

		test('should reject too many decimal places', () => {
			expect(isValidCurrency(100.999)).toBe(false);
		});
	});
});

describe('HIPAA Utilities', () => {
	describe('PHI Sanitization', () => {
		function sanitizeForLogging(data: Record<string, any>): Record<string, any> {
			const sensitiveFields = [
				'ssn', 'social_security', 'dob', 'date_of_birth', 'mrn',
				'medical_record_number', 'account_number', 'credit_card',
				'insurance_id', 'member_id', 'subscriber_id', 'bank_account',
			];
			
			const result: Record<string, any> = {};
			
			for (const [key, value] of Object.entries(data)) {
				const lowerKey = key.toLowerCase();
				if (sensitiveFields.some(f => lowerKey.includes(f))) {
					result[key] = '[REDACTED]';
				} else if (typeof value === 'object' && value !== null) {
					result[key] = sanitizeForLogging(value);
				} else {
					result[key] = value;
				}
			}
			
			return result;
		}

		test('should redact SSN', () => {
			const data = { name: 'John Doe', ssn: '123-45-6789' };
			const sanitized = sanitizeForLogging(data);
			expect(sanitized.ssn).toBe('[REDACTED]');
			expect(sanitized.name).toBe('John Doe');
		});

		test('should redact date of birth', () => {
			const data = { name: 'Jane Doe', date_of_birth: '1990-01-15' };
			const sanitized = sanitizeForLogging(data);
			expect(sanitized.date_of_birth).toBe('[REDACTED]');
		});

		test('should redact nested sensitive data', () => {
			const data = {
				patient: {
					name: 'John Doe',
					mrn: 'MRN12345',
				},
			};
			const sanitized = sanitizeForLogging(data);
			expect(sanitized.patient.mrn).toBe('[REDACTED]');
			expect(sanitized.patient.name).toBe('John Doe');
		});

		test('should preserve non-sensitive data', () => {
			const data = {
				provider: 'Dr. Smith',
				facility: 'General Hospital',
				claim_status: 'submitted',
			};
			const sanitized = sanitizeForLogging(data);
			expect(sanitized).toEqual(data);
		});
	});
});

describe('Analytics Utilities', () => {
	describe('Percentage Calculations', () => {
		function calculatePercentage(numerator: number, denominator: number): number {
			if (denominator === 0) return 0;
			return Math.round((numerator / denominator) * 10000) / 100;
		}

		test('should calculate percentage correctly', () => {
			expect(calculatePercentage(50, 100)).toBe(50);
			expect(calculatePercentage(1, 3)).toBe(33.33);
		});

		test('should handle zero denominator', () => {
			expect(calculatePercentage(50, 0)).toBe(0);
		});
	});

	describe('Days in A/R Calculation', () => {
		function calculateDaysInAR(totalAR: number, averageDailyCharges: number): number {
			if (averageDailyCharges === 0) return 0;
			return Math.round((totalAR / averageDailyCharges) * 10) / 10;
		}

		test('should calculate days in A/R', () => {
			expect(calculateDaysInAR(100000, 2500)).toBe(40);
		});

		test('should handle zero daily charges', () => {
			expect(calculateDaysInAR(100000, 0)).toBe(0);
		});
	});

	describe('Aging Bucket Classification', () => {
		function getAgingBucket(daysSinceService: number): string {
			if (daysSinceService <= 30) return '0-30';
			if (daysSinceService <= 60) return '31-60';
			if (daysSinceService <= 90) return '61-90';
			if (daysSinceService <= 120) return '91-120';
			return '120+';
		}

		test('should classify aging buckets correctly', () => {
			expect(getAgingBucket(15)).toBe('0-30');
			expect(getAgingBucket(45)).toBe('31-60');
			expect(getAgingBucket(75)).toBe('61-90');
			expect(getAgingBucket(100)).toBe('91-120');
			expect(getAgingBucket(150)).toBe('120+');
		});
	});
});
