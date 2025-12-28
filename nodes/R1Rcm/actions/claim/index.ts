/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from 'n8n-workflow';
import { r1RcmApiRequest, r1RcmApiRequestAllItems } from '../../transport/r1RcmClient';
import { ENDPOINTS } from '../../constants/endpoints';

export const claimOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['claim'],
      },
    },
    options: [
      { name: 'Create Claim', value: 'createClaim', action: 'Create a claim' },
      { name: 'Get Claim', value: 'getClaim', action: 'Get claim details' },
      { name: 'Submit Claim (837P/I/D)', value: 'submitClaim', action: 'Submit claim to payer' },
      { name: 'Get Claim Status (276/277)', value: 'getClaimStatus', action: 'Check claim status' },
      { name: 'Update Claim', value: 'updateClaim', action: 'Update claim information' },
      { name: 'Void Claim', value: 'voidClaim', action: 'Void a claim' },
      { name: 'Resubmit Claim', value: 'resubmitClaim', action: 'Resubmit a claim' },
      { name: 'Correct Claim', value: 'correctClaim', action: 'Submit claim correction' },
      { name: 'Get Claim History', value: 'getClaimHistory', action: 'Get claim history' },
      { name: 'Get Claim Lifecycle', value: 'getClaimLifecycle', action: 'Get full claim lifecycle' },
      { name: 'Get Claims by Patient', value: 'getClaimsByPatient', action: 'Get claims by patient' },
      { name: 'Get Claim Errors', value: 'getClaimErrors', action: 'Get claim errors and edits' },
    ],
    default: 'createClaim',
  },
];

export const claimFields: INodeProperties[] = [
  {
    displayName: 'Claim ID',
    name: 'claimId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['claim'],
        operation: ['getClaim', 'getClaimStatus', 'updateClaim', 'voidClaim', 'resubmitClaim', 'correctClaim', 'getClaimHistory', 'getClaimLifecycle', 'getClaimErrors'],
      },
    },
    default: '',
    description: 'The unique identifier for the claim',
  },
  {
    displayName: 'Patient ID',
    name: 'patientId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['claim'],
        operation: ['createClaim', 'getClaimsByPatient'],
      },
    },
    default: '',
    description: 'The patient ID',
  },
  // Create Claim
  {
    displayName: 'Claim Type',
    name: 'claimType',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['claim'],
        operation: ['createClaim', 'submitClaim'],
      },
    },
    options: [
      { name: '837P - Professional', value: '837P' },
      { name: '837I - Institutional', value: '837I' },
      { name: '837D - Dental', value: '837D' },
    ],
    default: '837P',
    description: 'Type of claim to create/submit',
  },
  {
    displayName: 'Claim Data',
    name: 'claimData',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['claim'],
        operation: ['createClaim'],
      },
    },
    default: {},
    options: [
      {
        name: 'claim',
        displayName: 'Claim',
        values: [
          {
            displayName: 'Encounter ID',
            name: 'encounterId',
            type: 'string',
            default: '',
            description: 'Source encounter ID',
          },
          {
            displayName: 'Payer ID',
            name: 'payerId',
            type: 'string',
            default: '',
            description: 'Primary payer ID',
          },
          {
            displayName: 'Subscriber ID',
            name: 'subscriberId',
            type: 'string',
            default: '',
            description: 'Insurance subscriber ID',
          },
          {
            displayName: 'Service Date From',
            name: 'serviceDateFrom',
            type: 'string',
            default: '',
            description: 'Service start date (YYYY-MM-DD)',
          },
          {
            displayName: 'Service Date To',
            name: 'serviceDateTo',
            type: 'string',
            default: '',
            description: 'Service end date (YYYY-MM-DD)',
          },
          {
            displayName: 'Billing Provider NPI',
            name: 'billingProviderNpi',
            type: 'string',
            default: '',
            description: 'Billing provider NPI',
          },
          {
            displayName: 'Rendering Provider NPI',
            name: 'renderingProviderNpi',
            type: 'string',
            default: '',
            description: 'Rendering provider NPI',
          },
          {
            displayName: 'Facility ID',
            name: 'facilityId',
            type: 'string',
            default: '',
            description: 'Service facility ID',
          },
          {
            displayName: 'Total Charge',
            name: 'totalCharge',
            type: 'number',
            default: 0,
            description: 'Total claim charge amount',
          },
          {
            displayName: 'Frequency Code',
            name: 'frequencyCode',
            type: 'options',
            options: [
              { name: '1 - Original', value: '1' },
              { name: '7 - Replacement', value: '7' },
              { name: '8 - Void', value: '8' },
            ],
            default: '1',
            description: 'Claim frequency/type code',
          },
        ],
      },
    ],
    description: 'Claim header information',
  },
  // Submit options
  {
    displayName: 'Submit Options',
    name: 'submitOptions',
    type: 'collection',
    placeholder: 'Add Option',
    displayOptions: {
      show: {
        resource: ['claim'],
        operation: ['submitClaim', 'resubmitClaim'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Clearinghouse',
        name: 'clearinghouse',
        type: 'options',
        options: [
          { name: 'Default', value: 'default' },
          { name: 'Availity', value: 'availity' },
          { name: 'Change Healthcare', value: 'change' },
          { name: 'Trizetto', value: 'trizetto' },
          { name: 'Direct to Payer', value: 'direct' },
        ],
        default: 'default',
        description: 'Clearinghouse to route claim through',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'options',
        options: [
          { name: 'Normal', value: 'normal' },
          { name: 'High', value: 'high' },
        ],
        default: 'normal',
        description: 'Submission priority',
      },
      {
        displayName: 'Test Mode',
        name: 'testMode',
        type: 'boolean',
        default: false,
        description: 'Whether to submit in test mode',
      },
    ],
  },
  // Update fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['claim'],
        operation: ['updateClaim'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Subscriber ID',
        name: 'subscriberId',
        type: 'string',
        default: '',
        description: 'Updated subscriber ID',
      },
      {
        displayName: 'Authorization Number',
        name: 'authorizationNumber',
        type: 'string',
        default: '',
        description: 'Prior authorization number',
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        default: '',
        description: 'Claim notes',
      },
    ],
  },
  // Void reason
  {
    displayName: 'Void Reason',
    name: 'voidReason',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['claim'],
        operation: ['voidClaim'],
      },
    },
    options: [
      { name: 'Duplicate Claim', value: 'duplicate' },
      { name: 'Incorrect Information', value: 'incorrect_info' },
      { name: 'Patient Request', value: 'patient_request' },
      { name: 'Administrative', value: 'administrative' },
      { name: 'Other', value: 'other' },
    ],
    default: 'duplicate',
    description: 'Reason for voiding the claim',
  },
  // Correction data
  {
    displayName: 'Correction Data',
    name: 'correctionData',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['claim'],
        operation: ['correctClaim'],
      },
    },
    default: {},
    options: [
      {
        name: 'correction',
        displayName: 'Correction',
        values: [
          {
            displayName: 'Correction Type',
            name: 'correctionType',
            type: 'options',
            options: [
              { name: 'Replace All', value: 'replace' },
              { name: 'Add Line', value: 'add_line' },
              { name: 'Delete Line', value: 'delete_line' },
              { name: 'Modify Line', value: 'modify_line' },
            ],
            default: 'replace',
            description: 'Type of correction',
          },
          {
            displayName: 'Corrected Data',
            name: 'correctedData',
            type: 'json',
            default: '{}',
            description: 'JSON object with corrected claim data',
          },
          {
            displayName: 'Correction Reason',
            name: 'correctionReason',
            type: 'string',
            default: '',
            description: 'Reason for correction',
          },
        ],
      },
    ],
    description: 'Claim correction details',
  },
  // Patient claims filters
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['claim'],
        operation: ['getClaimsByPatient'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Pending', value: 'pending' },
          { name: 'Submitted', value: 'submitted' },
          { name: 'Accepted', value: 'accepted' },
          { name: 'Rejected', value: 'rejected' },
          { name: 'Paid', value: 'paid' },
          { name: 'Denied', value: 'denied' },
        ],
        default: 'all',
        description: 'Filter by claim status',
      },
      {
        displayName: 'Date From',
        name: 'dateFrom',
        type: 'string',
        default: '',
        description: 'Service date from (YYYY-MM-DD)',
      },
      {
        displayName: 'Date To',
        name: 'dateTo',
        type: 'string',
        default: '',
        description: 'Service date to (YYYY-MM-DD)',
      },
      {
        displayName: 'Payer ID',
        name: 'payerId',
        type: 'string',
        default: '',
        description: 'Filter by payer',
      },
    ],
  },
];

export async function executeClaimOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let response: unknown;

  switch (operation) {
    case 'createClaim': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const claimType = this.getNodeParameter('claimType', index) as string;
      const claimData = this.getNodeParameter('claimData', index) as { claim?: Record<string, unknown> };

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: ENDPOINTS.CLAIM.CREATE,
        body: {
          patientId,
          claimType,
          ...(claimData.claim || {}),
        },
      });
      break;
    }

    case 'getClaim': {
      const claimId = this.getNodeParameter('claimId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.CLAIM.GET}/${claimId}`,
      });
      break;
    }

    case 'submitClaim': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      const claimType = this.getNodeParameter('claimType', index) as string;
      const submitOptions = this.getNodeParameter('submitOptions', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.CLAIM.SUBMIT}/${claimId}`,
        body: {
          claimType,
          ...submitOptions,
        },
      });
      break;
    }

    case 'getClaimStatus': {
      const claimId = this.getNodeParameter('claimId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.CLAIM.STATUS}/${claimId}`,
      });
      break;
    }

    case 'updateClaim': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      const updateFields = this.getNodeParameter('updateFields', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequest(this, {
        method: 'PUT',
        endpoint: `${ENDPOINTS.CLAIM.UPDATE}/${claimId}`,
        body: updateFields,
      });
      break;
    }

    case 'voidClaim': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      const voidReason = this.getNodeParameter('voidReason', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.CLAIM.VOID}/${claimId}`,
        body: { voidReason },
      });
      break;
    }

    case 'resubmitClaim': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      const submitOptions = this.getNodeParameter('submitOptions', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.CLAIM.RESUBMIT}/${claimId}`,
        body: submitOptions,
      });
      break;
    }

    case 'correctClaim': {
      const claimId = this.getNodeParameter('claimId', index) as string;
      const correctionData = this.getNodeParameter('correctionData', index) as { correction?: Record<string, unknown> };

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.CLAIM.CORRECT}/${claimId}`,
        body: correctionData.correction || {},
      });
      break;
    }

    case 'getClaimHistory': {
      const claimId = this.getNodeParameter('claimId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.CLAIM.HISTORY}/${claimId}`,
      });
      break;
    }

    case 'getClaimLifecycle': {
      const claimId = this.getNodeParameter('claimId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.CLAIM.LIFECYCLE}/${claimId}`,
      });
      break;
    }

    case 'getClaimsByPatient': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const filters = this.getNodeParameter('filters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.CLAIM.BY_PATIENT}/${patientId}`,
        query: {
          status: filters.status !== 'all' ? (filters.status as string) : undefined,
          dateFrom: filters.dateFrom as string,
          dateTo: filters.dateTo as string,
          payerId: filters.payerId as string,
        },
      });
      break;
    }

    case 'getClaimErrors': {
      const claimId = this.getNodeParameter('claimId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.CLAIM.ERRORS}/${claimId}`,
      });
      break;
    }

    default:
      throw new Error(`Operation ${operation} not supported`);
  }

  return [{ json: response as Record<string, unknown> }];
}
