/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * R1 RCM Denial Codes
 *
 * Claim Adjustment Reason Codes (CARC) and Remittance Advice Remark Codes (RARC)
 * for denial management and root cause analysis.
 */

// Common Claim Adjustment Reason Codes (CARC)
export const CARC_CODES = {
  '1': {
    code: '1',
    description: 'Deductible Amount',
    category: 'Patient Responsibility',
  },
  '2': {
    code: '2',
    description: 'Coinsurance Amount',
    category: 'Patient Responsibility',
  },
  '3': {
    code: '3',
    description: 'Co-payment Amount',
    category: 'Patient Responsibility',
  },
  '4': {
    code: '4',
    description: 'The procedure code is inconsistent with the modifier used',
    category: 'Coding Error',
  },
  '5': {
    code: '5',
    description: 'The procedure code/bill type is inconsistent with the place of service',
    category: 'Coding Error',
  },
  '6': {
    code: '6',
    description: 'The procedure/revenue code is inconsistent with the patient gender',
    category: 'Coding Error',
  },
  '9': {
    code: '9',
    description: 'The diagnosis is inconsistent with the patient gender',
    category: 'Coding Error',
  },
  '11': {
    code: '11',
    description: 'The diagnosis is inconsistent with the procedure',
    category: 'Coding Error',
  },
  '16': {
    code: '16',
    description: 'Claim/service lacks information or has submission/billing error(s)',
    category: 'Billing Error',
  },
  '18': {
    code: '18',
    description: 'Exact duplicate claim/service',
    category: 'Duplicate',
  },
  '19': {
    code: '19',
    description: 'This is a work-related injury/illness',
    category: 'Other Insurance',
  },
  '22': {
    code: '22',
    description:
      'This care may be covered by another payer per coordination of benefits',
    category: 'Other Insurance',
  },
  '23': {
    code: '23',
    description: 'The impact of prior payer(s) adjudication including payments and/or adjustments',
    category: 'Other Insurance',
  },
  '27': {
    code: '27',
    description: 'Expenses incurred after coverage terminated',
    category: 'Coverage',
  },
  '29': {
    code: '29',
    description: 'The time limit for filing has expired',
    category: 'Timely Filing',
  },
  '31': {
    code: '31',
    description: 'Patient cannot be identified as our insured',
    category: 'Coverage',
  },
  '32': {
    code: '32',
    description: 'Our records indicate that this dependent is not an eligible dependent',
    category: 'Coverage',
  },
  '33': {
    code: '33',
    description: 'Insured has no dependent coverage',
    category: 'Coverage',
  },
  '35': {
    code: '35',
    description: 'Lifetime benefit maximum has been reached',
    category: 'Benefit Limit',
  },
  '39': {
    code: '39',
    description: 'Services denied at the time authorization/pre-certification was requested',
    category: 'Authorization',
  },
  '45': {
    code: '45',
    description: 'Charge exceeds fee schedule/maximum allowable',
    category: 'Contractual',
  },
  '49': {
    code: '49',
    description: 'These are non-covered services because this is a routine exam',
    category: 'Non-Covered',
  },
  '50': {
    code: '50',
    description:
      'These are non-covered services because this is not deemed a medical necessity',
    category: 'Medical Necessity',
  },
  '55': {
    code: '55',
    description:
      'Procedure/treatment/drug is deemed investigational/not considered reasonable and necessary',
    category: 'Medical Necessity',
  },
  '96': {
    code: '96',
    description: 'Non-covered charge(s)',
    category: 'Non-Covered',
  },
  '97': {
    code: '97',
    description: 'The benefit for this service is included in the payment for another service',
    category: 'Bundling',
  },
  '119': {
    code: '119',
    description: 'Benefit maximum for this time period or occurrence has been reached',
    category: 'Benefit Limit',
  },
  '197': {
    code: '197',
    description: 'Precertification/authorization/notification absent',
    category: 'Authorization',
  },
  '198': {
    code: '198',
    description: 'Precertification/authorization/notification exceeded',
    category: 'Authorization',
  },
  '199': {
    code: '199',
    description: 'Revenue code and Procedure code do not match',
    category: 'Coding Error',
  },
  '234': {
    code: '234',
    description:
      'This procedure is not paid separately. Payment is included in the allowance for another service.',
    category: 'Bundling',
  },
  '236': {
    code: '236',
    description: 'This procedure or procedure/modifier combination is not compatible',
    category: 'Coding Error',
  },
  '242': {
    code: '242',
    description: 'Services not provided by network/primary care providers',
    category: 'Network',
  },
  '252': {
    code: '252',
    description: 'An attachment/other documentation is required to adjudicate this claim',
    category: 'Documentation',
  },
  '256': {
    code: '256',
    description: 'Service not payable per managed care contract',
    category: 'Contractual',
  },
} as const;

// Common Remittance Advice Remark Codes (RARC)
export const RARC_CODES = {
  M1: { code: 'M1', description: 'X-ray not taken within the past 12 months or near enough to the start of treatment' },
  M2: { code: 'M2', description: 'Not paid separately when the patient is an inpatient' },
  M15: { code: 'M15', description: 'Separately billed services/tests have been bundled' },
  M20: { code: 'M20', description: 'Missing/incomplete/invalid HCPCS' },
  M27: { code: 'M27', description: 'Missing/incomplete/invalid entitlement number or name' },
  M49: { code: 'M49', description: 'Missing/incomplete/invalid value code(s) or amount(s)' },
  M51: { code: 'M51', description: 'Missing/incomplete/invalid procedure code(s) and/or rate(s)' },
  M77: { code: 'M77', description: 'Missing/incomplete/invalid place of service' },
  M80: { code: 'M80', description: 'Not covered when performed during the same session/date' },
  M81: { code: 'M81', description: 'You have been overpaid. You must refund within 30 days' },
  MA01: { code: 'MA01', description: 'If you do not agree with what we approved for these services, you may appeal' },
  MA04: { code: 'MA04', description: 'Secondary payment cannot be made. Claim lacks required information' },
  MA07: { code: 'MA07', description: 'The claim information has been forwarded to another payer' },
  MA13: { code: 'MA13', description: 'You may be subject to penalties if you bill the patient for amounts not reported' },
  MA15: { code: 'MA15', description: 'Your claim has been separated to expedite handling' },
  MA18: { code: 'MA18', description: 'The claim information is also being forwarded to the patient Medicaid agency' },
  MA27: { code: 'MA27', description: 'Missing/incomplete/invalid entitlement number or name shown on the claim' },
  MA28: { code: 'MA28', description: 'Receipt of this claim by the payer does not waive timely filing limits' },
  MA92: { code: 'MA92', description: 'Missing/incomplete/invalid other diagnosis' },
  MA130: { code: 'MA130', description: 'Your claim contains incomplete and/or invalid information, and no appeal rights are afforded' },
  N1: { code: 'N1', description: 'Alert: You may appeal this decision' },
  N4: { code: 'N4', description: 'Missing/Incomplete/Invalid prior insurance carrier EOB' },
  N19: { code: 'N19', description: 'Procedure code incidental to primary procedure' },
  N30: { code: 'N30', description: 'Patient ineligible for this procedure' },
  N56: { code: 'N56', description: 'Procedure code billed is not correct/valid for the services billed' },
  N95: { code: 'N95', description: 'This benefit/service/drug is not a covered/reimbursable expense' },
  N115: { code: 'N115', description: 'This decision was based on a National Coverage Determination (NCD)' },
  N130: { code: 'N130', description: 'Consult our contractual agreement for specific information' },
  N211: { code: 'N211', description: 'Alert: You may not appeal this decision' },
  N362: { code: 'N362', description: 'The number of Days or Units of Service exceeds our acceptable maximum' },
  N381: { code: 'N381', description: 'Alert: The procedure or revenue code is inconsistent with the modifier' },
  N432: { code: 'N432', description: 'Alert: Claim was processed as adjustment to previous claim' },
} as const;

// Denial Categories for Analytics
export const DENIAL_CATEGORIES = {
  AUTHORIZATION: 'Authorization',
  BILLING_ERROR: 'Billing Error',
  BUNDLING: 'Bundling',
  CODING_ERROR: 'Coding Error',
  CONTRACTUAL: 'Contractual',
  COVERAGE: 'Coverage',
  DOCUMENTATION: 'Documentation',
  DUPLICATE: 'Duplicate',
  BENEFIT_LIMIT: 'Benefit Limit',
  MEDICAL_NECESSITY: 'Medical Necessity',
  NETWORK: 'Network',
  NON_COVERED: 'Non-Covered',
  OTHER_INSURANCE: 'Other Insurance',
  PATIENT_RESPONSIBILITY: 'Patient Responsibility',
  TIMELY_FILING: 'Timely Filing',
} as const;

// Options for n8n dropdowns
export const CARC_OPTIONS = Object.entries(CARC_CODES).map(([key, value]) => ({
  name: `${key} - ${value.description}`,
  value: key,
}));

export const RARC_OPTIONS = Object.entries(RARC_CODES).map(([key, value]) => ({
  name: `${key} - ${value.description}`,
  value: key,
}));

export const DENIAL_CATEGORY_OPTIONS = Object.entries(DENIAL_CATEGORIES).map(([key, value]) => ({
  name: value,
  value: key,
}));

/**
 * Get denial category from CARC code
 */
export function getDenialCategory(carcCode: string): string | undefined {
  const carc = CARC_CODES[carcCode as keyof typeof CARC_CODES];
  return carc?.category;
}

/**
 * Check if denial is appealable based on CARC code
 */
export function isAppealable(carcCode: string): boolean {
  const nonAppealable = ['1', '2', '3', '45']; // Patient responsibility and contractual
  return !nonAppealable.includes(carcCode);
}
