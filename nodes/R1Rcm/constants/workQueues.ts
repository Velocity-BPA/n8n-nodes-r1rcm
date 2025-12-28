/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * R1 RCM Work Queue Types
 *
 * Standard work queue classifications for revenue cycle management.
 */

export const WORK_QUEUE_TYPES = {
  // Patient Access Queues
  REGISTRATION: 'registration',
  PRE_REGISTRATION: 'pre-registration',
  ELIGIBILITY_VERIFICATION: 'eligibility-verification',
  FINANCIAL_CLEARANCE: 'financial-clearance',
  PRIOR_AUTH: 'prior-authorization',

  // Revenue Integrity Queues
  CHARGE_REVIEW: 'charge-review',
  CODING_REVIEW: 'coding-review',
  CDI_QUERY: 'cdi-query',
  CHARGE_CORRECTION: 'charge-correction',

  // Claims Queues
  CLAIM_EDIT: 'claim-edit',
  CLAIM_HOLD: 'claim-hold',
  CLAIM_REJECTION: 'claim-rejection',
  CLAIM_SUBMISSION: 'claim-submission',

  // Denial Management Queues
  DENIAL_REVIEW: 'denial-review',
  APPEAL_REQUIRED: 'appeal-required',
  APPEAL_FOLLOW_UP: 'appeal-follow-up',
  DENIAL_PREVENTION: 'denial-prevention',

  // Payment Queues
  PAYMENT_POSTING: 'payment-posting',
  PAYMENT_VARIANCE: 'payment-variance',
  UNDERPAYMENT: 'underpayment',
  REFUND: 'refund',
  TAKEBACK: 'takeback',

  // A/R Queues
  AR_FOLLOW_UP: 'ar-follow-up',
  HIGH_BALANCE: 'high-balance',
  AGED_AR: 'aged-ar',
  COLLECTION: 'collection',
  BAD_DEBT: 'bad-debt',

  // Integration Queues
  EPIC_SYNC: 'epic-sync',
  EPIC_ERROR: 'epic-error',
  INTERFACE_ERROR: 'interface-error',

  // Automation Queues
  RPA_EXCEPTION: 'rpa-exception',
  BOT_REVIEW: 'bot-review',
  AUTOMATION_FAILURE: 'automation-failure',
} as const;

export type WorkQueueType = (typeof WORK_QUEUE_TYPES)[keyof typeof WORK_QUEUE_TYPES];

export const WORK_QUEUE_PRIORITIES = {
  CRITICAL: 1,
  HIGH: 2,
  MEDIUM: 3,
  LOW: 4,
  SCHEDULED: 5,
} as const;

export type WorkQueuePriority = (typeof WORK_QUEUE_PRIORITIES)[keyof typeof WORK_QUEUE_PRIORITIES];

export const WORK_ITEM_STATUSES = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in-progress',
  ON_HOLD: 'on-hold',
  COMPLETED: 'completed',
  TRANSFERRED: 'transferred',
  ESCALATED: 'escalated',
  CANCELLED: 'cancelled',
} as const;

export type WorkItemStatus = (typeof WORK_ITEM_STATUSES)[keyof typeof WORK_ITEM_STATUSES];

export const SLA_LEVELS = {
  URGENT: { name: 'Urgent', hours: 4 },
  SAME_DAY: { name: 'Same Day', hours: 8 },
  NEXT_DAY: { name: 'Next Business Day', hours: 24 },
  TWO_DAY: { name: '2 Business Days', hours: 48 },
  WEEK: { name: '1 Week', hours: 168 },
  STANDARD: { name: 'Standard', hours: 336 },
} as const;

export const WORK_QUEUE_OPTIONS = Object.entries(WORK_QUEUE_TYPES).map(([key, value]) => ({
  name: key
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase()),
  value,
}));

export const PRIORITY_OPTIONS = Object.entries(WORK_QUEUE_PRIORITIES).map(([key, value]) => ({
  name: key.charAt(0) + key.slice(1).toLowerCase(),
  value,
}));

export const STATUS_OPTIONS = Object.entries(WORK_ITEM_STATUSES).map(([key, value]) => ({
  name: key
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase()),
  value,
}));
