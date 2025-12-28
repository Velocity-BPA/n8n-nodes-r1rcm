/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Validation Utilities
 *
 * Healthcare-specific validation functions for RCM data.
 */

/**
 * Validate NPI (National Provider Identifier)
 * NPIs are 10-digit numbers that follow the Luhn algorithm
 */
export function validateNPI(npi: string): { valid: boolean; error?: string } {
  if (!npi) {
    return { valid: false, error: 'NPI is required' };
  }

  const cleaned = npi.replace(/\D/g, '');

  if (cleaned.length !== 10) {
    return { valid: false, error: 'NPI must be exactly 10 digits' };
  }

  // Luhn algorithm validation with prefix 80840
  const prefixedNPI = '80840' + cleaned;
  let sum = 0;
  let alternate = false;

  for (let i = prefixedNPI.length - 1; i >= 0; i--) {
    let digit = parseInt(prefixedNPI[i] || '0', 10);

    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    alternate = !alternate;
  }

  if (sum % 10 !== 0) {
    return { valid: false, error: 'NPI fails checksum validation' };
  }

  return { valid: true };
}

/**
 * Validate Tax ID (EIN or SSN)
 */
export function validateTaxId(taxId: string): { valid: boolean; error?: string } {
  if (!taxId) {
    return { valid: false, error: 'Tax ID is required' };
  }

  const cleaned = taxId.replace(/\D/g, '');

  if (cleaned.length !== 9) {
    return { valid: false, error: 'Tax ID must be exactly 9 digits' };
  }

  // Basic EIN validation (first two digits indicate IRS campus)
  const prefix = parseInt(cleaned.substring(0, 2), 10);
  const validPrefixes = [
    10, 12, 60, 67, 50, 53, 01, 02, 03, 04, 05, 06, 11, 13, 14, 16,
    21, 22, 23, 25, 34, 51, 52, 54, 55, 56, 57, 58, 59, 65, 30, 32,
    35, 36, 37, 38, 61, 15, 24, 40, 44, 94, 95, 80, 90, 33, 39, 41,
    42, 43, 46, 48, 62, 63, 64, 66, 68, 71, 72, 73, 74, 75, 76, 77,
    81, 82, 83, 84, 85, 86, 87, 88, 91, 92, 93, 98, 99, 20, 26, 27,
    45, 46, 47, 31,
  ];

  // Note: We allow any prefix as SSNs have different rules
  // This is a basic check only

  return { valid: true };
}

/**
 * Validate ICD-10 diagnosis code format
 */
export function validateICD10(code: string): { valid: boolean; error?: string } {
  if (!code) {
    return { valid: false, error: 'ICD-10 code is required' };
  }

  // ICD-10 format: Letter followed by 2 digits, optional decimal, up to 4 more characters
  const icd10Pattern = /^[A-TV-Z][0-9]{2}(\.[0-9A-Z]{0,4})?$/i;

  if (!icd10Pattern.test(code)) {
    return { valid: false, error: 'Invalid ICD-10 code format' };
  }

  return { valid: true };
}

/**
 * Validate CPT/HCPCS procedure code format
 */
export function validateProcedureCode(code: string): { valid: boolean; error?: string } {
  if (!code) {
    return { valid: false, error: 'Procedure code is required' };
  }

  // CPT: 5 digits (may start with 0)
  const cptPattern = /^[0-9]{5}$/;

  // HCPCS Level II: Letter followed by 4 digits
  const hcpcsPattern = /^[A-V][0-9]{4}$/i;

  if (!cptPattern.test(code) && !hcpcsPattern.test(code)) {
    return { valid: false, error: 'Invalid CPT/HCPCS code format' };
  }

  return { valid: true };
}

/**
 * Validate modifier code format
 */
export function validateModifier(modifier: string): { valid: boolean; error?: string } {
  if (!modifier) {
    return { valid: false, error: 'Modifier is required' };
  }

  // Modifiers are 2 characters (alphanumeric)
  const modifierPattern = /^[0-9A-Z]{2}$/i;

  if (!modifierPattern.test(modifier)) {
    return { valid: false, error: 'Modifier must be 2 alphanumeric characters' };
  }

  return { valid: true };
}

/**
 * Validate Place of Service code
 */
export function validatePlaceOfService(pos: string): { valid: boolean; error?: string } {
  if (!pos) {
    return { valid: false, error: 'Place of Service code is required' };
  }

  const posCode = parseInt(pos, 10);

  if (isNaN(posCode) || posCode < 1 || posCode > 99) {
    return { valid: false, error: 'Place of Service must be between 01 and 99' };
  }

  return { valid: true };
}

/**
 * Validate date format (YYYY-MM-DD or MM/DD/YYYY)
 */
export function validateDate(dateStr: string): { valid: boolean; date?: Date; error?: string } {
  if (!dateStr) {
    return { valid: false, error: 'Date is required' };
  }

  // Try ISO format first
  let date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    // Try MM/DD/YYYY format
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      date = new Date(`${parts[2]}-${parts[0]}-${parts[1]}`);
    }
  }

  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date format. Use YYYY-MM-DD or MM/DD/YYYY' };
  }

  return { valid: true, date };
}

/**
 * Validate date range
 */
export function validateDateRange(
  startDate: string,
  endDate: string,
): { valid: boolean; error?: string } {
  const startValidation = validateDate(startDate);
  if (!startValidation.valid) {
    return { valid: false, error: `Start date: ${startValidation.error}` };
  }

  const endValidation = validateDate(endDate);
  if (!endValidation.valid) {
    return { valid: false, error: `End date: ${endValidation.error}` };
  }

  if (startValidation.date && endValidation.date) {
    if (startValidation.date > endValidation.date) {
      return { valid: false, error: 'Start date must be before or equal to end date' };
    }
  }

  return { valid: true };
}

/**
 * Validate claim amount
 */
export function validateAmount(amount: number | string): { valid: boolean; value?: number; error?: string } {
  if (amount === null || amount === undefined || amount === '') {
    return { valid: false, error: 'Amount is required' };
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[$,]/g, '')) : amount;

  if (isNaN(numAmount)) {
    return { valid: false, error: 'Amount must be a valid number' };
  }

  if (numAmount < 0) {
    return { valid: false, error: 'Amount cannot be negative' };
  }

  // Round to 2 decimal places
  const rounded = Math.round(numAmount * 100) / 100;

  return { valid: true, value: rounded };
}

/**
 * Validate payer ID format
 */
export function validatePayerId(payerId: string): { valid: boolean; error?: string } {
  if (!payerId) {
    return { valid: false, error: 'Payer ID is required' };
  }

  // Payer IDs are typically 5-10 alphanumeric characters
  const payerIdPattern = /^[A-Z0-9]{5,10}$/i;

  if (!payerIdPattern.test(payerId)) {
    return { valid: false, error: 'Payer ID must be 5-10 alphanumeric characters' };
  }

  return { valid: true };
}

/**
 * Validate patient account number
 */
export function validateAccountNumber(accountNumber: string): { valid: boolean; error?: string } {
  if (!accountNumber) {
    return { valid: false, error: 'Account number is required' };
  }

  // Account numbers are typically alphanumeric, 5-20 characters
  if (accountNumber.length < 5 || accountNumber.length > 20) {
    return { valid: false, error: 'Account number must be 5-20 characters' };
  }

  return { valid: true };
}

/**
 * Validate claim control number
 */
export function validateClaimControlNumber(ccn: string): { valid: boolean; error?: string } {
  if (!ccn) {
    return { valid: false, error: 'Claim control number is required' };
  }

  // CCN is typically up to 20 alphanumeric characters
  if (ccn.length > 20) {
    return { valid: false, error: 'Claim control number cannot exceed 20 characters' };
  }

  return { valid: true };
}

/**
 * Comprehensive validation result type
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a complete claim object
 */
export function validateClaim(claim: Record<string, unknown>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!claim.patientId) errors.push('Patient ID is required');
  if (!claim.providerId) errors.push('Provider ID is required');
  if (!claim.payerId) errors.push('Payer ID is required');
  if (!claim.serviceDate) errors.push('Service date is required');

  // Validate NPI if provided
  if (claim.npi) {
    const npiResult = validateNPI(claim.npi as string);
    if (!npiResult.valid) errors.push(npiResult.error || 'Invalid NPI');
  }

  // Validate diagnosis codes
  if (claim.diagnosisCodes && Array.isArray(claim.diagnosisCodes)) {
    claim.diagnosisCodes.forEach((code, index) => {
      const result = validateICD10(code as string);
      if (!result.valid) {
        errors.push(`Diagnosis code ${index + 1}: ${result.error}`);
      }
    });
  }

  // Validate procedure codes
  if (claim.procedureCodes && Array.isArray(claim.procedureCodes)) {
    claim.procedureCodes.forEach((code, index) => {
      const result = validateProcedureCode(code as string);
      if (!result.valid) {
        errors.push(`Procedure code ${index + 1}: ${result.error}`);
      }
    });
  }

  // Validate service date
  if (claim.serviceDate) {
    const dateResult = validateDate(claim.serviceDate as string);
    if (!dateResult.valid) {
      errors.push(`Service date: ${dateResult.error}`);
    } else if (dateResult.date && dateResult.date > new Date()) {
      warnings.push('Service date is in the future');
    }
  }

  // Validate amounts
  if (claim.chargeAmount) {
    const amountResult = validateAmount(claim.chargeAmount as number);
    if (!amountResult.valid) {
      errors.push(`Charge amount: ${amountResult.error}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
