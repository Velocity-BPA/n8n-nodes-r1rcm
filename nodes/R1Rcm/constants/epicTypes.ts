/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * R1 RCM Epic Integration Types
 *
 * Message types and constants for Epic EHR integration.
 */

// Epic Message Types
export const EPIC_MESSAGE_TYPES = {
  // ADT Messages (Admission, Discharge, Transfer)
  ADT_A01: { code: 'ADT_A01', description: 'Patient Admission' },
  ADT_A02: { code: 'ADT_A02', description: 'Patient Transfer' },
  ADT_A03: { code: 'ADT_A03', description: 'Patient Discharge' },
  ADT_A04: { code: 'ADT_A04', description: 'Patient Registration' },
  ADT_A05: { code: 'ADT_A05', description: 'Patient Pre-Admission' },
  ADT_A06: { code: 'ADT_A06', description: 'Change Outpatient to Inpatient' },
  ADT_A07: { code: 'ADT_A07', description: 'Change Inpatient to Outpatient' },
  ADT_A08: { code: 'ADT_A08', description: 'Patient Information Update' },
  ADT_A11: { code: 'ADT_A11', description: 'Cancel Admission' },
  ADT_A13: { code: 'ADT_A13', description: 'Cancel Discharge' },
  ADT_A18: { code: 'ADT_A18', description: 'Patient Merge' },
  ADT_A28: { code: 'ADT_A28', description: 'Add Person Information' },
  ADT_A31: { code: 'ADT_A31', description: 'Update Person Information' },
  ADT_A40: { code: 'ADT_A40', description: 'Merge Patient' },

  // DFT Messages (Detailed Financial Transaction)
  DFT_P03: { code: 'DFT_P03', description: 'Post Detail Financial Transaction' },
  DFT_P11: { code: 'DFT_P11', description: 'Post Detail Financial Transaction (New)' },

  // BAR Messages (Billing Account Record)
  BAR_P01: { code: 'BAR_P01', description: 'Add/Change Billing Account' },
  BAR_P02: { code: 'BAR_P02', description: 'Purge Patient Account' },
  BAR_P05: { code: 'BAR_P05', description: 'Update Account' },
  BAR_P06: { code: 'BAR_P06', description: 'End Account' },

  // SIU Messages (Scheduling Information Unsolicited)
  SIU_S12: { code: 'SIU_S12', description: 'New Appointment' },
  SIU_S13: { code: 'SIU_S13', description: 'Rescheduled Appointment' },
  SIU_S14: { code: 'SIU_S14', description: 'Modified Appointment' },
  SIU_S15: { code: 'SIU_S15', description: 'Cancelled Appointment' },
  SIU_S17: { code: 'SIU_S17', description: 'Deleted Appointment' },

  // ORU Messages (Observation Result)
  ORU_R01: { code: 'ORU_R01', description: 'Unsolicited Observation Result' },

  // ORM Messages (Order Message)
  ORM_O01: { code: 'ORM_O01', description: 'Order Message' },

  // RDE Messages (Pharmacy/Treatment Encoded Order)
  RDE_O11: { code: 'RDE_O11', description: 'Pharmacy/Treatment Encoded Order' },

  // MDM Messages (Medical Document Management)
  MDM_T02: { code: 'MDM_T02', description: 'Original Document Notification' },
  MDM_T04: { code: 'MDM_T04', description: 'Document Status Change' },
} as const;

export type EpicMessageType = keyof typeof EPIC_MESSAGE_TYPES;

// Epic FHIR Resource Types
export const EPIC_FHIR_RESOURCES = {
  PATIENT: 'Patient',
  ENCOUNTER: 'Encounter',
  ACCOUNT: 'Account',
  COVERAGE: 'Coverage',
  CLAIM: 'Claim',
  CLAIM_RESPONSE: 'ClaimResponse',
  EXPLANATION_OF_BENEFIT: 'ExplanationOfBenefit',
  PRACTITIONER: 'Practitioner',
  ORGANIZATION: 'Organization',
  LOCATION: 'Location',
  PROCEDURE: 'Procedure',
  CONDITION: 'Condition',
  OBSERVATION: 'Observation',
  DOCUMENT_REFERENCE: 'DocumentReference',
  APPOINTMENT: 'Appointment',
  SERVICE_REQUEST: 'ServiceRequest',
  CHARGE_ITEM: 'ChargeItem',
  INVOICE: 'Invoice',
} as const;

// Epic Sync Directions
export const EPIC_SYNC_DIRECTIONS = {
  EPIC_TO_R1: 'epic-to-r1',
  R1_TO_EPIC: 'r1-to-epic',
  BIDIRECTIONAL: 'bidirectional',
} as const;

// Epic Integration Statuses
export const EPIC_INTEGRATION_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  PARTIAL: 'partial',
  CONFLICT: 'conflict',
  RECONCILED: 'reconciled',
} as const;

// Epic Error Types
export const EPIC_ERROR_TYPES = {
  CONNECTION: 'connection',
  AUTHENTICATION: 'authentication',
  VALIDATION: 'validation',
  MAPPING: 'mapping',
  CONFLICT: 'conflict',
  TIMEOUT: 'timeout',
  RATE_LIMIT: 'rate-limit',
  UNKNOWN: 'unknown',
} as const;

// Options for n8n dropdowns
export const EPIC_MESSAGE_TYPE_OPTIONS = Object.entries(EPIC_MESSAGE_TYPES).map(([key, value]) => ({
  name: `${value.code} - ${value.description}`,
  value: key,
}));

export const EPIC_FHIR_RESOURCE_OPTIONS = Object.entries(EPIC_FHIR_RESOURCES).map(
  ([key, value]) => ({
    name: value,
    value,
  }),
);

export const EPIC_SYNC_DIRECTION_OPTIONS = [
  { name: 'Epic to R1 RCM', value: EPIC_SYNC_DIRECTIONS.EPIC_TO_R1 },
  { name: 'R1 RCM to Epic', value: EPIC_SYNC_DIRECTIONS.R1_TO_EPIC },
  { name: 'Bidirectional', value: EPIC_SYNC_DIRECTIONS.BIDIRECTIONAL },
];

export const EPIC_STATUS_OPTIONS = Object.entries(EPIC_INTEGRATION_STATUSES).map(([key, value]) => ({
  name: key
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase()),
  value,
}));
