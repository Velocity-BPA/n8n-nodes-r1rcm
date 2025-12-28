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

export const patientAccessOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['patientAccess'],
      },
    },
    options: [
      { name: 'Get Patient Info', value: 'getPatientInfo', action: 'Get patient information' },
      { name: 'Search Patients', value: 'searchPatients', action: 'Search for patients' },
      { name: 'Create Patient', value: 'createPatient', action: 'Create a new patient' },
      { name: 'Update Patient', value: 'updatePatient', action: 'Update patient information' },
      { name: 'Get Patient Demographics', value: 'getDemographics', action: 'Get patient demographics' },
      { name: 'Verify Patient Identity', value: 'verifyIdentity', action: 'Verify patient identity' },
      { name: 'Get Insurance Coverage', value: 'getInsuranceCoverage', action: 'Get insurance coverage' },
      { name: 'Get Financial Clearance', value: 'getFinancialClearance', action: 'Get financial clearance status' },
      { name: 'Get Patient Responsibility Estimate', value: 'getResponsibilityEstimate', action: 'Get patient responsibility estimate' },
      { name: 'Check Coverage Discovery', value: 'checkCoverageDiscovery', action: 'Check for undiscovered coverage' },
      { name: 'Get Propensity to Pay', value: 'getPropensityToPay', action: 'Get propensity to pay score' },
    ],
    default: 'getPatientInfo',
  },
];

export const patientAccessFields: INodeProperties[] = [
  // Get Patient Info
  {
    displayName: 'Patient ID',
    name: 'patientId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['patientAccess'],
        operation: ['getPatientInfo', 'getDemographics', 'verifyIdentity', 'getInsuranceCoverage', 'getFinancialClearance', 'getResponsibilityEstimate', 'checkCoverageDiscovery', 'getPropensityToPay', 'updatePatient'],
      },
    },
    default: '',
    description: 'The unique identifier for the patient',
  },
  // Search Patients
  {
    displayName: 'Search Criteria',
    name: 'searchCriteria',
    type: 'collection',
    placeholder: 'Add Search Criteria',
    displayOptions: {
      show: {
        resource: ['patientAccess'],
        operation: ['searchPatients'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'Patient first name',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'Patient last name',
      },
      {
        displayName: 'Date of Birth',
        name: 'dateOfBirth',
        type: 'string',
        default: '',
        description: 'Patient date of birth (YYYY-MM-DD)',
      },
      {
        displayName: 'MRN',
        name: 'mrn',
        type: 'string',
        default: '',
        description: 'Medical Record Number',
      },
      {
        displayName: 'SSN (Last 4)',
        name: 'ssnLast4',
        type: 'string',
        default: '',
        description: 'Last 4 digits of SSN',
      },
      {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'Patient phone number',
      },
      {
        displayName: 'Account Number',
        name: 'accountNumber',
        type: 'string',
        default: '',
        description: 'Patient account number',
      },
    ],
  },
  // Create Patient
  {
    displayName: 'Patient Data',
    name: 'patientData',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['patientAccess'],
        operation: ['createPatient'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        required: true,
        description: 'Patient first name',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        required: true,
        description: 'Patient last name',
      },
      {
        displayName: 'Middle Name',
        name: 'middleName',
        type: 'string',
        default: '',
        description: 'Patient middle name',
      },
      {
        displayName: 'Date of Birth',
        name: 'dateOfBirth',
        type: 'string',
        default: '',
        required: true,
        description: 'Patient date of birth (YYYY-MM-DD)',
      },
      {
        displayName: 'Gender',
        name: 'gender',
        type: 'options',
        options: [
          { name: 'Male', value: 'M' },
          { name: 'Female', value: 'F' },
          { name: 'Unknown', value: 'U' },
          { name: 'Other', value: 'O' },
        ],
        default: 'U',
        description: 'Patient gender',
      },
      {
        displayName: 'SSN',
        name: 'ssn',
        type: 'string',
        default: '',
        description: 'Social Security Number',
      },
      {
        displayName: 'Address Line 1',
        name: 'addressLine1',
        type: 'string',
        default: '',
        description: 'Street address',
      },
      {
        displayName: 'Address Line 2',
        name: 'addressLine2',
        type: 'string',
        default: '',
        description: 'Apartment, suite, etc.',
      },
      {
        displayName: 'City',
        name: 'city',
        type: 'string',
        default: '',
        description: 'City',
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'string',
        default: '',
        description: 'State code (2 letters)',
      },
      {
        displayName: 'Zip Code',
        name: 'zipCode',
        type: 'string',
        default: '',
        description: 'ZIP code',
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'Primary phone number',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Email address',
      },
      {
        displayName: 'Emergency Contact Name',
        name: 'emergencyContactName',
        type: 'string',
        default: '',
        description: 'Emergency contact name',
      },
      {
        displayName: 'Emergency Contact Phone',
        name: 'emergencyContactPhone',
        type: 'string',
        default: '',
        description: 'Emergency contact phone',
      },
    ],
  },
  // Update Patient
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['patientAccess'],
        operation: ['updatePatient'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        default: '',
        description: 'Patient first name',
      },
      {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        default: '',
        description: 'Patient last name',
      },
      {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        default: '',
        description: 'Primary phone number',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Email address',
      },
      {
        displayName: 'Address Line 1',
        name: 'addressLine1',
        type: 'string',
        default: '',
        description: 'Street address',
      },
      {
        displayName: 'City',
        name: 'city',
        type: 'string',
        default: '',
        description: 'City',
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'string',
        default: '',
        description: 'State code',
      },
      {
        displayName: 'Zip Code',
        name: 'zipCode',
        type: 'string',
        default: '',
        description: 'ZIP code',
      },
    ],
  },
  // Encounter ID for responsibility estimate
  {
    displayName: 'Encounter ID',
    name: 'encounterId',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['patientAccess'],
        operation: ['getResponsibilityEstimate'],
      },
    },
    default: '',
    description: 'The encounter ID for which to estimate responsibility',
  },
  // Return All for search
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['patientAccess'],
        operation: ['searchPatients'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['patientAccess'],
        operation: ['searchPatients'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 50,
    description: 'Max number of results to return',
  },
];

export async function executePatientAccessOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let responseData;

  switch (operation) {
    case 'getPatientInfo': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.patientAccess.base}${ENDPOINTS.patientAccess.patient}/${patientId}`,
      });
      break;
    }
    case 'searchPatients': {
      const searchCriteria = this.getNodeParameter('searchCriteria', index) as Record<string, string>;
      const returnAll = this.getNodeParameter('returnAll', index) as boolean;
      if (returnAll) {
        responseData = await r1RcmApiRequestAllItems(this, {
          method: 'GET',
          endpoint: `${ENDPOINTS.patientAccess.base}${ENDPOINTS.patientAccess.patient}`,
          query: searchCriteria,
        });
      } else {
        const limit = this.getNodeParameter('limit', index) as number;
        responseData = await r1RcmApiRequest(this, {
          method: 'GET',
          endpoint: `${ENDPOINTS.patientAccess.base}${ENDPOINTS.patientAccess.patient}`,
          query: { ...searchCriteria, limit: limit.toString() },
        });
      }
      break;
    }
    case 'createPatient': {
      const patientData = this.getNodeParameter('patientData', index) as Record<string, unknown>;
      responseData = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.patientAccess.base}${ENDPOINTS.patientAccess.patient}`,
        body: patientData,
      });
      break;
    }
    case 'updatePatient': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const updateFields = this.getNodeParameter('updateFields', index) as Record<string, unknown>;
      responseData = await r1RcmApiRequest(this, {
        method: 'PUT',
        endpoint: `${ENDPOINTS.patientAccess.base}${ENDPOINTS.patientAccess.patient}/${patientId}`,
        body: updateFields,
      });
      break;
    }
    case 'getDemographics': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.patientAccess.base}${ENDPOINTS.patientAccess.demographics}/${patientId}`,
      });
      break;
    }
    case 'verifyIdentity': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.patientAccess.base}${ENDPOINTS.patientAccess.identity}/${patientId}/verify`,
      });
      break;
    }
    case 'getInsuranceCoverage': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.patientAccess.base}${ENDPOINTS.patientAccess.insurance}/${patientId}`,
      });
      break;
    }
    case 'getFinancialClearance': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.patientAccess.base}${ENDPOINTS.patientAccess.financialClearance}/${patientId}`,
      });
      break;
    }
    case 'getResponsibilityEstimate': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      const encounterId = this.getNodeParameter('encounterId', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.patientAccess.base}${ENDPOINTS.patientAccess.estimate}`,
        query: { patientId, encounterId },
      });
      break;
    }
    case 'checkCoverageDiscovery': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.patientAccess.base}${ENDPOINTS.patientAccess.coverageDiscovery}/${patientId}`,
      });
      break;
    }
    case 'getPropensityToPay': {
      const patientId = this.getNodeParameter('patientId', index) as string;
      responseData = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.patientAccess.base}${ENDPOINTS.patientAccess.propensityToPay}/${patientId}`,
      });
      break;
    }
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return this.helpers.returnJsonArray(responseData as unknown[]);
}
