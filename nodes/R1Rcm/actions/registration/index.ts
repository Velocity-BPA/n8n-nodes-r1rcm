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

export const registrationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['registration'],
      },
    },
    options: [
      { name: 'Create Registration', value: 'createRegistration', action: 'Create a new registration' },
      { name: 'Get Registration', value: 'getRegistration', action: 'Get registration details' },
      { name: 'Update Registration', value: 'updateRegistration', action: 'Update registration' },
      { name: 'Get Registration Status', value: 'getRegistrationStatus', action: 'Get registration status' },
      { name: 'Complete Registration', value: 'completeRegistration', action: 'Complete a registration' },
      { name: 'Cancel Registration', value: 'cancelRegistration', action: 'Cancel a registration' },
      { name: 'Get Pre-Registration Info', value: 'getPreRegistration', action: 'Get pre-registration information' },
      { name: 'Get Registration Queue', value: 'getRegistrationQueue', action: 'Get registration queue' },
    ],
    default: 'getRegistration',
  },
];

export const registrationFields: INodeProperties[] = [
  {
    displayName: 'Registration ID',
    name: 'registrationId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['registration'],
        operation: ['getRegistration', 'updateRegistration', 'getRegistrationStatus', 'completeRegistration', 'cancelRegistration'],
      },
    },
    default: '',
    description: 'The unique registration identifier',
  },
  {
    displayName: 'Patient ID',
    name: 'patientId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['registration'],
        operation: ['createRegistration', 'getPreRegistration'],
      },
    },
    default: '',
    description: 'The patient identifier',
  },
  {
    displayName: 'Registration Data',
    name: 'registrationData',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['registration'],
        operation: ['createRegistration'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Encounter Type',
        name: 'encounterType',
        type: 'options',
        options: [
          { name: 'Inpatient', value: 'inpatient' },
          { name: 'Outpatient', value: 'outpatient' },
          { name: 'Emergency', value: 'emergency' },
          { name: 'Observation', value: 'observation' },
          { name: 'Ambulatory Surgery', value: 'ambulatory_surgery' },
        ],
        default: 'outpatient',
      },
      {
        displayName: 'Facility ID',
        name: 'facilityId',
        type: 'string',
        default: '',
        description: 'Facility where service will be provided',
      },
      {
        displayName: 'Department',
        name: 'department',
        type: 'string',
        default: '',
        description: 'Department for the visit',
      },
      {
        displayName: 'Provider NPI',
        name: 'providerNpi',
        type: 'string',
        default: '',
        description: 'Attending provider NPI',
      },
      {
        displayName: 'Scheduled Date',
        name: 'scheduledDate',
        type: 'string',
        default: '',
        description: 'Scheduled appointment date (YYYY-MM-DD)',
      },
      {
        displayName: 'Scheduled Time',
        name: 'scheduledTime',
        type: 'string',
        default: '',
        description: 'Scheduled appointment time (HH:MM)',
      },
      {
        displayName: 'Reason for Visit',
        name: 'reasonForVisit',
        type: 'string',
        default: '',
        description: 'Chief complaint or reason for visit',
      },
      {
        displayName: 'Primary Insurance ID',
        name: 'primaryInsuranceId',
        type: 'string',
        default: '',
        description: 'Primary insurance policy ID',
      },
      {
        displayName: 'Referral Number',
        name: 'referralNumber',
        type: 'string',
        default: '',
        description: 'Referral authorization number if applicable',
      },
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['registration'],
        operation: ['updateRegistration'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Pending', value: 'pending' },
          { name: 'In Progress', value: 'in_progress' },
          { name: 'Completed', value: 'completed' },
          { name: 'On Hold', value: 'on_hold' },
        ],
        default: 'pending',
      },
      {
        displayName: 'Scheduled Date',
        name: 'scheduledDate',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Provider NPI',
        name: 'providerNpi',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Notes',
        name: 'notes',
        type: 'string',
        default: '',
      },
    ],
  },
  {
    displayName: 'Cancellation Reason',
    name: 'cancellationReason',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['registration'],
        operation: ['cancelRegistration'],
      },
    },
    default: '',
    description: 'Reason for cancellation',
  },
  {
    displayName: 'Queue Filters',
    name: 'queueFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['registration'],
        operation: ['getRegistrationQueue'],
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
          { name: 'In Progress', value: 'in_progress' },
          { name: 'Completed', value: 'completed' },
        ],
        default: 'pending',
      },
      {
        displayName: 'Facility ID',
        name: 'facilityId',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Date From',
        name: 'dateFrom',
        type: 'string',
        default: '',
        description: 'Start date filter (YYYY-MM-DD)',
      },
      {
        displayName: 'Date To',
        name: 'dateTo',
        type: 'string',
        default: '',
        description: 'End date filter (YYYY-MM-DD)',
      },
    ],
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['registration'],
        operation: ['getRegistrationQueue'],
      },
    },
    default: false,
    description: 'Whether to return all results',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['registration'],
        operation: ['getRegistrationQueue'],
        returnAll: [false],
      },
    },
    typeOptions: { minValue: 1, maxValue: 100 },
    default: 50,
  },
];

export async function executeRegistrationOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let responseData;

  switch (operation) {
    case 'createRegistration': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const registrationData = this.getNodeParameter('registrationData', index) as Record<string, unknown>;
      responseData = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.registration.base}${ENDPOINTS.registration.register}`,
        body: { patientId, ...registrationData },
      });
      break;
    }
    case 'getRegistration': {
      const registrationId = this.getNodeParameter('registrationId', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.registration.base}/${registrationId}`,
      });
      break;
    }
    case 'updateRegistration': {
      const registrationId = this.getNodeParameter('registrationId', index) as string;
      const updateFields = this.getNodeParameter('updateFields', index) as Record<string, unknown>;
      responseData = await r1RcmApiRequest(this, {
        method: 'PUT',
        endpoint: `${ENDPOINTS.registration.base}/${registrationId}`,
        body: updateFields,
      });
      break;
    }
    case 'getRegistrationStatus': {
      const registrationId = this.getNodeParameter('registrationId', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.registration.base}${ENDPOINTS.registration.status}/${registrationId}`,
      });
      break;
    }
    case 'completeRegistration': {
      const registrationId = this.getNodeParameter('registrationId', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.registration.base}${ENDPOINTS.registration.complete}/${registrationId}`,
      });
      break;
    }
    case 'cancelRegistration': {
      const registrationId = this.getNodeParameter('registrationId', index) as string;
      const cancellationReason = this.getNodeParameter('cancellationReason', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.registration.base}${ENDPOINTS.registration.cancel}/${registrationId}`,
        body: { reason: cancellationReason },
      });
      break;
    }
    case 'getPreRegistration': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.registration.base}${ENDPOINTS.registration.preRegistration}/${patientId}`,
      });
      break;
    }
    case 'getRegistrationQueue': {
      const queueFilters = this.getNodeParameter('queueFilters', index) as Record<string, string>;
      const returnAll = this.getNodeParameter('returnAll', index) as boolean;
      if (returnAll) {
        responseData = await r1RcmApiRequestAllItems(this, {
          method: 'GET',
          endpoint: `${ENDPOINTS.registration.base}${ENDPOINTS.registration.queue}`,
          query: queueFilters,
        });
      } else {
        const limit = this.getNodeParameter('limit', index) as number;
        responseData = await r1RcmApiRequest(this, {
          method: 'GET',
          endpoint: `${ENDPOINTS.registration.base}${ENDPOINTS.registration.queue}`,
          query: { ...queueFilters, limit: limit.toString() },
        });
      }
      break;
    }
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return this.helpers.returnJsonArray(responseData as unknown[]);
}
