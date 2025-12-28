/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * HIPAA Compliance Utilities
 *
 * Utilities for handling Protected Health Information (PHI) securely.
 * These utilities help ensure HIPAA compliance when processing healthcare data.
 */

/**
 * PHI field identifiers per HIPAA Safe Harbor method
 */
export const PHI_IDENTIFIERS = [
  'name',
  'firstName',
  'lastName',
  'middleName',
  'address',
  'streetAddress',
  'city',
  'state',
  'zipCode',
  'zip',
  'postalCode',
  'dateOfBirth',
  'dob',
  'birthDate',
  'age', // when > 89
  'phone',
  'phoneNumber',
  'telephone',
  'fax',
  'faxNumber',
  'email',
  'emailAddress',
  'ssn',
  'socialSecurityNumber',
  'mrn',
  'medicalRecordNumber',
  'healthPlanId',
  'accountNumber',
  'certificateNumber',
  'licenseNumber',
  'vehicleId',
  'deviceId',
  'url',
  'ipAddress',
  'biometric',
  'photo',
  'image',
] as const;

/**
 * Mask a string value for logging (show first and last characters only)
 */
export function maskValue(value: string, showChars = 2): string {
  if (!value || value.length <= showChars * 2) {
    return '*'.repeat(value?.length || 4);
  }
  const start = value.substring(0, showChars);
  const end = value.substring(value.length - showChars);
  const middle = '*'.repeat(Math.min(value.length - showChars * 2, 6));
  return `${start}${middle}${end}`;
}

/**
 * Mask SSN (show last 4 only)
 */
export function maskSSN(ssn: string): string {
  if (!ssn) return '';
  const cleaned = ssn.replace(/\D/g, '');
  if (cleaned.length < 4) return '*'.repeat(cleaned.length);
  return `***-**-${cleaned.slice(-4)}`;
}

/**
 * Mask date of birth (show year only)
 */
export function maskDateOfBirth(dob: string): string {
  if (!dob) return '';
  try {
    const date = new Date(dob);
    return `**/**/****`;
  } catch {
    return '**/**/****';
  }
}

/**
 * Mask phone number (show last 4 only)
 */
export function maskPhone(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return '*'.repeat(cleaned.length);
  return `(***) ***-${cleaned.slice(-4)}`;
}

/**
 * Mask email address (show first 2 chars of local part)
 */
export function maskEmail(email: string): string {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return maskValue(email);
  const local = parts[0];
  const domain = parts[1];
  const maskedLocal = local.substring(0, 2) + '*'.repeat(Math.min(local.length - 2, 6));
  return `${maskedLocal}@${domain}`;
}

/**
 * Mask MRN (show last 4 characters only)
 */
export function maskMRN(mrn: string): string {
  if (!mrn) return '';
  if (mrn.length <= 4) return '*'.repeat(mrn.length);
  return '*'.repeat(mrn.length - 4) + mrn.slice(-4);
}

/**
 * Check if a field name likely contains PHI
 */
export function isPHIField(fieldName: string): boolean {
  const normalized = fieldName.toLowerCase().replace(/[_-]/g, '');
  return PHI_IDENTIFIERS.some((identifier) => normalized.includes(identifier.toLowerCase()));
}

/**
 * Sanitize an object for safe logging by masking PHI fields
 */
export function sanitizeForLogging<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      sanitized[key] = value;
      continue;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeForLogging(value as Record<string, unknown>);
      continue;
    }

    if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'object' && item !== null
          ? sanitizeForLogging(item as Record<string, unknown>)
          : item,
      );
      continue;
    }

    if (typeof value === 'string' && isPHIField(key)) {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('ssn') || lowerKey.includes('social')) {
        sanitized[key] = maskSSN(value);
      } else if (lowerKey.includes('dob') || lowerKey.includes('birth') || lowerKey.includes('date')) {
        sanitized[key] = maskDateOfBirth(value);
      } else if (lowerKey.includes('phone') || lowerKey.includes('fax') || lowerKey.includes('tel')) {
        sanitized[key] = maskPhone(value);
      } else if (lowerKey.includes('email')) {
        sanitized[key] = maskEmail(value);
      } else if (lowerKey.includes('mrn') || lowerKey.includes('medical')) {
        sanitized[key] = maskMRN(value);
      } else {
        sanitized[key] = maskValue(value);
      }
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Create a HIPAA-compliant audit log entry
 */
export interface AuditLogEntry {
  timestamp: string;
  action: string;
  resource: string;
  resourceId?: string;
  userId?: string;
  organizationId?: string;
  facilityId?: string;
  ipAddress?: string;
  success: boolean;
  errorMessage?: string;
  additionalContext?: Record<string, unknown>;
}

export function createAuditLogEntry(
  action: string,
  resource: string,
  options: Partial<Omit<AuditLogEntry, 'timestamp' | 'action' | 'resource'>> = {},
): AuditLogEntry {
  return {
    timestamp: new Date().toISOString(),
    action,
    resource,
    success: true,
    ...options,
  };
}

/**
 * Validate that required HIPAA-compliant headers are present
 */
export function validateHIPAAHeaders(headers: Record<string, string>): string[] {
  const errors: string[] = [];
  const requiredHeaders = ['X-Organization-Id'];

  for (const header of requiredHeaders) {
    if (!headers[header]) {
      errors.push(`Missing required header: ${header}`);
    }
  }

  return errors;
}
