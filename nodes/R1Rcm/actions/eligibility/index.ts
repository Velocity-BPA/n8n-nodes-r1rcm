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
import { r1RcmApiRequest } from '../../transport/r1RcmClient';
import { ENDPOINTS } from '../../constants/endpoints';

export const eligibilityOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['eligibility'],
      },
    },
    options: [
      { name: 'Check Eligibility (270/271)', value: 'checkEligibility', action: 'Check patient eligibility' },
      { name: 'Get Real-Time Eligibility', value: 'getRealTimeEligibility', action: 'Get real-time eligibility' },
      { name: 'Batch Eligibility Check', value: 'batchEligibilityCheck', action: 'Batch eligibility verification' },
      { name: 'Get Benefits Summary', value: 'getBenefitsSummary', action: 'Get benefits summary' },
      { name: 'Get Coverage Details', value: 'getCoverageDetails', action: 'Get coverage details' },
      { name: 'Get Deductible Info', value: 'getDeductibleInfo', action: 'Get deductible information' },
      { name: 'Get Copay Info', value: 'getCopayInfo', action: 'Get copay information' },
      { name: 'Get Prior Auth Requirements', value: 'getPriorAuthRequirements', action: 'Get prior authorization requirements' },
      { name: 'Get Eligibility History', value: 'getEligibilityHistory', action: 'Get eligibility verification history' },
    ],
    default: 'checkEligibility',
  },
];

export const eligibilityFields: INodeProperties[] = [
  {
    displayName: 'Patient ID',
    name: 'patientId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['checkEligibility', 'getRealTimeEligibility', 'getBenefitsSummary', 'getCoverageDetails', 'getDeductibleInfo', 'getCopayInfo', 'getPriorAuthRequirements', 'getEligibilityHistory'],
      },
    },
    default: '',
    description: 'The unique identifier for the patient',
  },
  {
    displayName: 'Payer ID',
    name: 'payerId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['checkEligibility', 'getRealTimeEligibility', 'getBenefitsSummary', 'getCoverageDetails'],
      },
    },
    default: '',
    description: 'The payer/insurance company ID',
  },
  {
    displayName: 'Service Type',
    name: 'serviceType',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['checkEligibility', 'getRealTimeEligibility', 'getPriorAuthRequirements'],
      },
    },
    options: [
      { name: 'Medical', value: '30' },
      { name: 'Mental Health', value: 'MH' },
      { name: 'Dental', value: '35' },
      { name: 'Vision', value: 'VIS' },
      { name: 'Prescription Drug', value: '88' },
      { name: 'Hospital Inpatient', value: '47' },
      { name: 'Hospital Outpatient', value: '50' },
      { name: 'Emergency Services', value: '86' },
      { name: 'Professional (Physician)', value: '98' },
      { name: 'Skilled Nursing', value: 'AG' },
      { name: 'Home Health', value: '42' },
      { name: 'Durable Medical Equipment', value: '12' },
      { name: 'Lab Services', value: '5' },
      { name: 'Radiology', value: '73' },
      { name: 'Chiropractic', value: '33' },
      { name: 'Physical Therapy', value: 'PT' },
    ],
    default: '30',
    description: 'Type of service to check eligibility for (X12 270/271 service type codes)',
  },
  {
    displayName: 'Date of Service',
    name: 'dateOfService',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['checkEligibility', 'getRealTimeEligibility', 'getCoverageDetails'],
      },
    },
    default: '',
    description: 'Date of service to check (YYYY-MM-DD). Defaults to today if not specified.',
  },
  {
    displayName: 'Provider NPI',
    name: 'providerNpi',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['checkEligibility', 'getRealTimeEligibility', 'getPriorAuthRequirements'],
      },
    },
    default: '',
    description: 'National Provider Identifier for the requesting provider',
  },
  // Batch Eligibility
  {
    displayName: 'Patient IDs',
    name: 'patientIds',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['batchEligibilityCheck'],
      },
    },
    default: '',
    description: 'Comma-separated list of patient IDs to check',
  },
  {
    displayName: 'Insurance Type',
    name: 'insuranceType',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['getCoverageDetails', 'getDeductibleInfo', 'getCopayInfo'],
      },
    },
    options: [
      { name: 'Primary', value: 'primary' },
      { name: 'Secondary', value: 'secondary' },
      { name: 'Tertiary', value: 'tertiary' },
    ],
    default: 'primary',
    description: 'Which insurance coverage to check',
  },
  // History filters
  {
    displayName: 'Date Range',
    name: 'dateRange',
    type: 'fixedCollection',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['getEligibilityHistory'],
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
    description: 'Date range for eligibility history',
  },
  // Prior Auth Requirements
  {
    displayName: 'Procedure Code',
    name: 'procedureCode',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['getPriorAuthRequirements'],
      },
    },
    default: '',
    description: 'CPT/HCPCS procedure code to check requirements for',
  },
  {
    displayName: 'Place of Service',
    name: 'placeOfService',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['eligibility'],
        operation: ['getPriorAuthRequirements'],
      },
    },
    options: [
      { name: 'Office', value: '11' },
      { name: 'Home', value: '12' },
      { name: 'Outpatient Hospital', value: '22' },
      { name: 'Inpatient Hospital', value: '21' },
      { name: 'Emergency Room', value: '23' },
      { name: 'Ambulatory Surgical Center', value: '24' },
      { name: 'Skilled Nursing Facility', value: '31' },
    ],
    default: '11',
    description: 'Place of service code',
  },
];

export async function executeEligibilityOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let response: unknown;

  switch (operation) {
    case 'checkEligibility': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const payerId = this.getNodeParameter('payerId', index) as string;
      const serviceType = this.getNodeParameter('serviceType', index) as string;
      const dateOfService = this.getNodeParameter('dateOfService', index, '') as string;
      const providerNpi = this.getNodeParameter('providerNpi', index, '') as string;

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: ENDPOINTS.ELIGIBILITY.CHECK,
        body: {
          patientId,
          payerId,
          serviceType,
          dateOfService: dateOfService || new Date().toISOString().split('T')[0],
          providerNpi,
        },
      });
      break;
    }

    case 'getRealTimeEligibility': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const payerId = this.getNodeParameter('payerId', index) as string;
      const serviceType = this.getNodeParameter('serviceType', index) as string;
      const dateOfService = this.getNodeParameter('dateOfService', index, '') as string;
      const providerNpi = this.getNodeParameter('providerNpi', index, '') as string;

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: ENDPOINTS.ELIGIBILITY.REALTIME,
        body: {
          patientId,
          payerId,
          serviceType,
          dateOfService: dateOfService || new Date().toISOString().split('T')[0],
          providerNpi,
          realTime: true,
        },
      });
      break;
    }

    case 'batchEligibilityCheck': {
      const patientIdsStr = this.getNodeParameter('patientIds', index) as string;
      const patientIds = patientIdsStr.split(',').map((id) => id.trim());

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: ENDPOINTS.ELIGIBILITY.BATCH,
        body: {
          patientIds,
        },
      });
      break;
    }

    case 'getBenefitsSummary': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const payerId = this.getNodeParameter('payerId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.ELIGIBILITY.BENEFITS}/${patientId}`,
        query: { payerId },
      });
      break;
    }

    case 'getCoverageDetails': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const payerId = this.getNodeParameter('payerId', index) as string;
      const insuranceType = this.getNodeParameter('insuranceType', index) as string;
      const dateOfService = this.getNodeParameter('dateOfService', index, '') as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.ELIGIBILITY.COVERAGE}/${patientId}`,
        query: {
          payerId,
          insuranceType,
          dateOfService,
        },
      });
      break;
    }

    case 'getDeductibleInfo': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const insuranceType = this.getNodeParameter('insuranceType', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.ELIGIBILITY.DEDUCTIBLE}/${patientId}`,
        query: { insuranceType },
      });
      break;
    }

    case 'getCopayInfo': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const insuranceType = this.getNodeParameter('insuranceType', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.ELIGIBILITY.COPAY}/${patientId}`,
        query: { insuranceType },
      });
      break;
    }

    case 'getPriorAuthRequirements': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const serviceType = this.getNodeParameter('serviceType', index) as string;
      const procedureCode = this.getNodeParameter('procedureCode', index, '') as string;
      const placeOfService = this.getNodeParameter('placeOfService', index, '') as string;
      const providerNpi = this.getNodeParameter('providerNpi', index, '') as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.ELIGIBILITY.PRIOR_AUTH_REQUIREMENTS,
        query: {
          patientId,
          serviceType,
          procedureCode,
          placeOfService,
          providerNpi,
        },
      });
      break;
    }

    case 'getEligibilityHistory': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const dateRange = this.getNodeParameter('dateRange', index, {}) as { range?: { startDate?: string; endDate?: string } };

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.ELIGIBILITY.HISTORY}/${patientId}`,
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
