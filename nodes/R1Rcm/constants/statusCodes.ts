/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * R1 RCM Status Codes
 *
 * Standard status codes for claims, eligibility, and transactions.
 */

// Claim Status Codes (277 Status Category Codes)
export const CLAIM_STATUS_CATEGORIES = {
  A0: { code: 'A0', description: 'Acknowledgement/Receipt - The claim has been received' },
  A1: { code: 'A1', description: 'Acknowledgement/Receipt - The claim has been forwarded' },
  A2: {
    code: 'A2',
    description: 'Acknowledgement/Receipt - The claim has been accepted into adjudication',
  },
  A3: {
    code: 'A3',
    description: 'Acknowledgement/Receipt - The claim has been returned as unprocessable',
  },
  A4: { code: 'A4', description: 'Acknowledgement/Receipt - The claim has been rejected' },
  A5: {
    code: 'A5',
    description: 'Acknowledgement/Receipt - The claim has been split for adjudication',
  },
  P0: { code: 'P0', description: 'Pending - Adjudication has not been completed' },
  P1: { code: 'P1', description: 'Pending - Awaiting additional information' },
  P2: { code: 'P2', description: 'Pending - Under review' },
  P3: { code: 'P3', description: 'Pending - Awaiting attachment' },
  P4: { code: 'P4', description: 'Pending - Awaiting COB information' },
  P5: { code: 'P5', description: 'Pending - Waiting period applies' },
  F0: { code: 'F0', description: 'Finalized - Adjudication complete without payment' },
  F1: { code: 'F1', description: 'Finalized - Payment made' },
  F2: { code: 'F2', description: 'Finalized - Denied' },
  F3: { code: 'F3', description: 'Finalized - Payment has been made' },
  F4: { code: 'F4', description: 'Finalized - Reversal of previous payment' },
  R0: { code: 'R0', description: 'Request for additional information - General' },
  R1: { code: 'R1', description: 'Request for additional information - Medical records' },
  R3: { code: 'R3', description: 'Request for additional information - Documentation' },
  R4: { code: 'R4', description: 'Request for additional information - Prior authorization' },
  R5: { code: 'R5', description: 'Request for additional information - Coordination of benefits' },
  E0: { code: 'E0', description: 'Error - Cannot process claim' },
  E1: { code: 'E1', description: 'Error - Response not possible' },
  E2: { code: 'E2', description: 'Error - Information holder unknown' },
  E3: { code: 'E3', description: 'Error - Syntax error' },
  E4: { code: 'E4', description: 'Error - Information receiver ID unknown' },
} as const;

export type ClaimStatusCategory = keyof typeof CLAIM_STATUS_CATEGORIES;

// Eligibility Status Codes (271 Response Codes)
export const ELIGIBILITY_STATUS_CODES = {
  '1': { code: '1', description: 'Active Coverage' },
  '2': { code: '2', description: 'Active - Full Risk Capitation' },
  '3': { code: '3', description: 'Active - Services Capitated' },
  '4': { code: '4', description: 'Active - Services Capitated to Primary Care Physician' },
  '5': { code: '5', description: 'Active - Pending Investigation' },
  '6': { code: '6', description: 'Inactive' },
  '7': { code: '7', description: 'Inactive - Pending Eligibility Update' },
  '8': { code: '8', description: 'Inactive - Pending Investigation' },
  A: { code: 'A', description: 'Co-Insurance' },
  B: { code: 'B', description: 'Co-Payment' },
  C: { code: 'C', description: 'Deductible' },
  CB: { code: 'CB', description: 'Coverage Basis' },
  D: { code: 'D', description: 'Benefit Description' },
  E: { code: 'E', description: 'Exclusions' },
  F: { code: 'F', description: 'Limitations' },
  G: { code: 'G', description: 'Out of Pocket (Stop Loss)' },
  H: { code: 'H', description: 'Unlimited' },
  I: { code: 'I', description: 'Non-Covered' },
  J: { code: 'J', description: 'Cost Containment' },
  K: { code: 'K', description: 'Reserve' },
  L: { code: 'L', description: 'Primary Care Provider' },
  M: { code: 'M', description: 'Pre-existing Condition' },
  MC: { code: 'MC', description: 'Managed Care Coordinator' },
  N: { code: 'N', description: 'Services Restricted to Following Provider' },
  O: { code: 'O', description: 'Not Deemed a Medical Necessity' },
  P: { code: 'P', description: 'Benefit Disclaimer' },
  Q: { code: 'Q', description: 'Second Surgical Opinion Required' },
  R: { code: 'R', description: 'Other or Additional Payor' },
  S: { code: 'S', description: 'Prior Year(s) History' },
  T: { code: 'T', description: 'Card(s) Reported Lost/Stolen' },
  U: { code: 'U', description: 'Contact Following Entity for Eligibility' },
  V: { code: 'V', description: 'Cannot Process' },
  W: { code: 'W', description: 'Other Source of Data' },
  X: { code: 'X', description: 'Health Care Facility' },
  Y: { code: 'Y', description: 'Spend Down' },
} as const;

// Prior Authorization Status Codes
export const PRIOR_AUTH_STATUS_CODES = {
  A1: { code: 'A1', description: 'Certified in Total' },
  A2: { code: 'A2', description: 'Certified - Partial' },
  A3: { code: 'A3', description: 'Not Certified' },
  A4: { code: 'A4', description: 'Pended' },
  A5: { code: 'A5', description: 'Modified' },
  A6: { code: 'A6', description: 'Contact Payer' },
  CT: { code: 'CT', description: 'Cancel - Previous Certification' },
  NA: { code: 'NA', description: 'No Action Required' },
} as const;

// Transaction Type Codes
export const TRANSACTION_TYPES = {
  '270': { code: '270', description: 'Eligibility Inquiry' },
  '271': { code: '271', description: 'Eligibility Response' },
  '276': { code: '276', description: 'Claim Status Inquiry' },
  '277': { code: '277', description: 'Claim Status Response' },
  '278': { code: '278', description: 'Prior Authorization Request/Response' },
  '835': { code: '835', description: 'Electronic Remittance Advice' },
  '837I': { code: '837I', description: 'Institutional Claim' },
  '837P': { code: '837P', description: 'Professional Claim' },
  '837D': { code: '837D', description: 'Dental Claim' },
  '999': { code: '999', description: 'Implementation Acknowledgement' },
  TA1: { code: 'TA1', description: 'Interchange Acknowledgement' },
} as const;

// Options for n8n dropdowns
export const CLAIM_STATUS_OPTIONS = Object.entries(CLAIM_STATUS_CATEGORIES).map(
  ([key, value]) => ({
    name: `${key} - ${value.description}`,
    value: key,
  }),
);

export const ELIGIBILITY_STATUS_OPTIONS = Object.entries(ELIGIBILITY_STATUS_CODES).map(
  ([key, value]) => ({
    name: `${key} - ${value.description}`,
    value: key,
  }),
);

export const PRIOR_AUTH_STATUS_OPTIONS = Object.entries(PRIOR_AUTH_STATUS_CODES).map(
  ([key, value]) => ({
    name: `${key} - ${value.description}`,
    value: key,
  }),
);

export const TRANSACTION_TYPE_OPTIONS = Object.entries(TRANSACTION_TYPES).map(([key, value]) => ({
  name: `${value.code} - ${value.description}`,
  value: key,
}));
