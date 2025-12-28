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

export const priorAuthOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['priorAuth'],
      },
    },
    options: [
      { name: 'Submit Prior Auth', value: 'submitPriorAuth', action: 'Submit prior authorization request' },
      { name: 'Get Prior Auth Status', value: 'getPriorAuthStatus', action: 'Get prior authorization status' },
      { name: 'Update Prior Auth', value: 'updatePriorAuth', action: 'Update prior authorization' },
      { name: 'Cancel Prior Auth', value: 'cancelPriorAuth', action: 'Cancel prior authorization' },
      { name: 'Get Auth Reference', value: 'getAuthReference', action: 'Get authorization reference number' },
      { name: 'Get Auth Requirements', value: 'getAuthRequirements', action: 'Get authorization requirements' },
      { name: 'Track Auth Request', value: 'trackAuthRequest', action: 'Track authorization request' },
      { name: 'Get Auth Queue', value: 'getAuthQueue', action: 'Get authorization work queue' },
      { name: 'Get Auth History', value: 'getAuthHistory', action: 'Get authorization history' },
    ],
    default: 'submitPriorAuth',
  },
];

export const priorAuthFields: INodeProperties[] = [
  // Auth ID for status/update/cancel operations
  {
    displayName: 'Authorization ID',
    name: 'authId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['priorAuth'],
        operation: ['getPriorAuthStatus', 'updatePriorAuth', 'cancelPriorAuth', 'trackAuthRequest'],
      },
    },
    default: '',
    description: 'The unique identifier for the prior authorization',
  },
  // Patient ID
  {
    displayName: 'Patient ID',
    name: 'patientId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['priorAuth'],
        operation: ['submitPriorAuth', 'getAuthRequirements', 'getAuthHistory'],
      },
    },
    default: '',
    description: 'The unique identifier for the patient',
  },
  // Submit Prior Auth fields
  {
    displayName: 'Payer ID',
    name: 'payerId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['priorAuth'],
        operation: ['submitPriorAuth'],
      },
    },
    default: '',
    description: 'The payer/insurance company ID',
  },
  {
    displayName: 'Service Details',
    name: 'serviceDetails',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['priorAuth'],
        operation: ['submitPriorAuth'],
      },
    },
    default: {},
    options: [
      {
        name: 'service',
        displayName: 'Service',
        values: [
          {
            displayName: 'Procedure Code',
            name: 'procedureCode',
            type: 'string',
            default: '',
            description: 'CPT/HCPCS procedure code',
          },
          {
            displayName: 'Diagnosis Code',
            name: 'diagnosisCode',
            type: 'string',
            default: '',
            description: 'ICD-10 diagnosis code',
          },
          {
            displayName: 'Quantity',
            name: 'quantity',
            type: 'number',
            default: 1,
            description: 'Number of units requested',
          },
          {
            displayName: 'Service Start Date',
            name: 'serviceStartDate',
            type: 'string',
            default: '',
            description: 'Requested service start date (YYYY-MM-DD)',
          },
          {
            displayName: 'Service End Date',
            name: 'serviceEndDate',
            type: 'string',
            default: '',
            description: 'Requested service end date (YYYY-MM-DD)',
          },
        ],
      },
    ],
    description: 'Details of the service requiring authorization',
  },
  {
    displayName: 'Provider NPI',
    name: 'providerNpi',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['priorAuth'],
        operation: ['submitPriorAuth'],
      },
    },
    default: '',
    description: 'National Provider Identifier for the requesting provider',
  },
  {
    displayName: 'Facility ID',
    name: 'facilityId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['priorAuth'],
        operation: ['submitPriorAuth'],
      },
    },
    default: '',
    description: 'Facility where service will be performed',
  },
  {
    displayName: 'Urgency',
    name: 'urgency',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['priorAuth'],
        operation: ['submitPriorAuth'],
      },
    },
    options: [
      { name: 'Standard', value: 'standard' },
      { name: 'Urgent', value: 'urgent' },
      { name: 'Emergency', value: 'emergency' },
    ],
    default: 'standard',
    description: 'Urgency level of the authorization request',
  },
  {
    displayName: 'Clinical Notes',
    name: 'clinicalNotes',
    type: 'string',
    typeOptions: {
      rows: 4,
    },
    displayOptions: {
      show: {
        resource: ['priorAuth'],
        operation: ['submitPriorAuth', 'updatePriorAuth'],
      },
    },
    default: '',
    description: 'Clinical notes supporting the authorization request',
  },
  // Update fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['priorAuth'],
        operation: ['updatePriorAuth'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Additional Documentation',
        name: 'additionalDocumentation',
        type: 'string',
        default: '',
        description: 'Additional documentation to attach',
      },
      {
        displayName: 'Extended End Date',
        name: 'extendedEndDate',
        type: 'string',
        default: '',
        description: 'Request extension to end date (YYYY-MM-DD)',
      },
      {
        displayName: 'Additional Units',
        name: 'additionalUnits',
        type: 'number',
        default: 0,
        description: 'Request additional units',
      },
    ],
  },
  // Cancel reason
  {
    displayName: 'Cancellation Reason',
    name: 'cancellationReason',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['priorAuth'],
        operation: ['cancelPriorAuth'],
      },
    },
    options: [
      { name: 'Service No Longer Needed', value: 'not_needed' },
      { name: 'Patient Request', value: 'patient_request' },
      { name: 'Duplicate Request', value: 'duplicate' },
      { name: 'Provider Change', value: 'provider_change' },
      { name: 'Insurance Change', value: 'insurance_change' },
      { name: 'Other', value: 'other' },
    ],
    default: 'not_needed',
    description: 'Reason for cancelling the authorization',
  },
  // Queue filters
  {
    displayName: 'Queue Filters',
    name: 'queueFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['priorAuth'],
        operation: ['getAuthQueue'],
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
          { name: 'In Review', value: 'in_review' },
          { name: 'Approved', value: 'approved' },
          { name: 'Denied', value: 'denied' },
          { name: 'Expired', value: 'expired' },
        ],
        default: 'all',
        description: 'Filter by authorization status',
      },
      {
        displayName: 'Assigned To',
        name: 'assignedTo',
        type: 'string',
        default: '',
        description: 'Filter by assigned user ID',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'High', value: 'high' },
          { name: 'Medium', value: 'medium' },
          { name: 'Low', value: 'low' },
        ],
        default: 'all',
        description: 'Filter by priority level',
      },
      {
        displayName: 'Payer',
        name: 'payerId',
        type: 'string',
        default: '',
        description: 'Filter by payer ID',
      },
    ],
  },
  // History filters
  {
    displayName: 'Date Range',
    name: 'dateRange',
    type: 'fixedCollection',
    displayOptions: {
      show: {
        resource: ['priorAuth'],
        operation: ['getAuthHistory'],
      },
    },
    default: {},
    options: [
      {
        name: 'range',
        displayName: 'Date Range',
        values: [
          {
            displayName: 'Start Date',
            name: 'startDate',
            type: 'string',
            default: '',
            description: 'Start date (YYYY-MM-DD)',
          },
          {
            displayName: 'End Date',
            name: 'endDate',
            type: 'string',
            default: '',
            description: 'End date (YYYY-MM-DD)',
          },
        ],
      },
    ],
    description: 'Date range for authorization history',
  },
];

export async function executePriorAuthOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let response: unknown;

  switch (operation) {
    case 'submitPriorAuth': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const payerId = this.getNodeParameter('payerId', index) as string;
      const serviceDetails = this.getNodeParameter('serviceDetails', index) as { service?: Record<string, unknown> };
      const providerNpi = this.getNodeParameter('providerNpi', index) as string;
      const facilityId = this.getNodeParameter('facilityId', index, '') as string;
      const urgency = this.getNodeParameter('urgency', index) as string;
      const clinicalNotes = this.getNodeParameter('clinicalNotes', index, '') as string;

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: ENDPOINTS.PRIOR_AUTH.SUBMIT,
        body: {
          patientId,
          payerId,
          serviceDetails: serviceDetails.service || {},
          providerNpi,
          facilityId,
          urgency,
          clinicalNotes,
        },
      });
      break;
    }

    case 'getPriorAuthStatus': {
      const authId = this.getNodeParameter('authId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.PRIOR_AUTH.STATUS}/${authId}`,
      });
      break;
    }

    case 'updatePriorAuth': {
      const authId = this.getNodeParameter('authId', index) as string;
      const clinicalNotes = this.getNodeParameter('clinicalNotes', index, '') as string;
      const updateFields = this.getNodeParameter('updateFields', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequest(this, {
        method: 'PUT',
        endpoint: `${ENDPOINTS.PRIOR_AUTH.UPDATE}/${authId}`,
        body: {
          clinicalNotes,
          ...updateFields,
        },
      });
      break;
    }

    case 'cancelPriorAuth': {
      const authId = this.getNodeParameter('authId', index) as string;
      const cancellationReason = this.getNodeParameter('cancellationReason', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.PRIOR_AUTH.CANCEL}/${authId}`,
        body: { cancellationReason },
      });
      break;
    }

    case 'getAuthReference': {
      const authId = this.getNodeParameter('authId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.PRIOR_AUTH.REFERENCE}/${authId}`,
      });
      break;
    }

    case 'getAuthRequirements': {
      const patientId = this.getNodeParameter('patientId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.PRIOR_AUTH.REQUIREMENTS,
        query: { patientId },
      });
      break;
    }

    case 'trackAuthRequest': {
      const authId = this.getNodeParameter('authId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.PRIOR_AUTH.TRACK}/${authId}`,
      });
      break;
    }

    case 'getAuthQueue': {
      const queueFilters = this.getNodeParameter('queueFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: ENDPOINTS.PRIOR_AUTH.QUEUE,
        query: {
          status: queueFilters.status !== 'all' ? (queueFilters.status as string) : undefined,
          assignedTo: queueFilters.assignedTo as string,
          priority: queueFilters.priority !== 'all' ? (queueFilters.priority as string) : undefined,
          payerId: queueFilters.payerId as string,
        },
      });
      break;
    }

    case 'getAuthHistory': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const dateRange = this.getNodeParameter('dateRange', index, {}) as { range?: { startDate?: string; endDate?: string } };

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.PRIOR_AUTH.HISTORY}/${patientId}`,
        query: {
          startDate: dateRange.range?.startDate,
          endDate: dateRange.range?.endDate,
        },
      });
      break;
    }

    default:
      throw new Error(`Operation ${operation} not supported`);
  }

  return [{ json: response as Record<string, unknown> }];
}
