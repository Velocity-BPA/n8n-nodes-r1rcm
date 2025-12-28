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

export const chargeCaptureOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['chargeCapture'],
      },
    },
    options: [
      { name: 'Create Charge', value: 'createCharge', action: 'Create a charge' },
      { name: 'Get Charge', value: 'getCharge', action: 'Get charge details' },
      { name: 'Update Charge', value: 'updateCharge', action: 'Update a charge' },
      { name: 'Delete Charge', value: 'deleteCharge', action: 'Delete a charge' },
      { name: 'Get Charges by Encounter', value: 'getChargesByEncounter', action: 'Get charges by encounter' },
      { name: 'Get Charges by Patient', value: 'getChargesByPatient', action: 'Get charges by patient' },
      { name: 'Get Unbilled Charges', value: 'getUnbilledCharges', action: 'Get unbilled charges' },
      { name: 'Get Charge Lag', value: 'getChargeLag', action: 'Get charge lag report' },
    ],
    default: 'createCharge',
  },
];

export const chargeCaptureFields: INodeProperties[] = [
  {
    displayName: 'Charge ID',
    name: 'chargeId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['chargeCapture'],
        operation: ['getCharge', 'updateCharge', 'deleteCharge'],
      },
    },
    default: '',
    description: 'The unique identifier for the charge',
  },
  {
    displayName: 'Encounter ID',
    name: 'encounterId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['chargeCapture'],
        operation: ['createCharge', 'getChargesByEncounter'],
      },
    },
    default: '',
    description: 'The encounter ID associated with the charge',
  },
  {
    displayName: 'Patient ID',
    name: 'patientId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['chargeCapture'],
        operation: ['getChargesByPatient'],
      },
    },
    default: '',
    description: 'The patient ID',
  },
  // Create/Update charge details
  {
    displayName: 'Charge Details',
    name: 'chargeDetails',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['chargeCapture'],
        operation: ['createCharge'],
      },
    },
    default: {},
    options: [
      {
        name: 'charge',
        displayName: 'Charge',
        values: [
          {
            displayName: 'Procedure Code',
            name: 'procedureCode',
            type: 'string',
            default: '',
            description: 'CPT/HCPCS procedure code',
          },
          {
            displayName: 'Modifiers',
            name: 'modifiers',
            type: 'string',
            default: '',
            description: 'Comma-separated list of modifiers (e.g., 25,59)',
          },
          {
            displayName: 'Diagnosis Codes',
            name: 'diagnosisCodes',
            type: 'string',
            default: '',
            description: 'Comma-separated ICD-10 diagnosis codes',
          },
          {
            displayName: 'Units',
            name: 'units',
            type: 'number',
            default: 1,
            description: 'Number of units',
          },
          {
            displayName: 'Service Date',
            name: 'serviceDate',
            type: 'string',
            default: '',
            description: 'Date of service (YYYY-MM-DD)',
          },
          {
            displayName: 'Provider NPI',
            name: 'providerNpi',
            type: 'string',
            default: '',
            description: 'Rendering provider NPI',
          },
          {
            displayName: 'Place of Service',
            name: 'placeOfService',
            type: 'options',
            options: [
              { name: 'Office', value: '11' },
              { name: 'Home', value: '12' },
              { name: 'Outpatient Hospital', value: '22' },
              { name: 'Inpatient Hospital', value: '21' },
              { name: 'Emergency Room', value: '23' },
              { name: 'Ambulatory Surgical Center', value: '24' },
              { name: 'Skilled Nursing Facility', value: '31' },
              { name: 'Telehealth', value: '02' },
            ],
            default: '11',
            description: 'Place of service code',
          },
          {
            displayName: 'Charge Amount',
            name: 'chargeAmount',
            type: 'number',
            default: 0,
            description: 'Charge amount in dollars',
          },
        ],
      },
    ],
    description: 'Charge entry details',
  },
  // Update fields
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    displayOptions: {
      show: {
        resource: ['chargeCapture'],
        operation: ['updateCharge'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Procedure Code',
        name: 'procedureCode',
        type: 'string',
        default: '',
        description: 'CPT/HCPCS procedure code',
      },
      {
        displayName: 'Modifiers',
        name: 'modifiers',
        type: 'string',
        default: '',
        description: 'Comma-separated list of modifiers',
      },
      {
        displayName: 'Diagnosis Codes',
        name: 'diagnosisCodes',
        type: 'string',
        default: '',
        description: 'Comma-separated ICD-10 diagnosis codes',
      },
      {
        displayName: 'Units',
        name: 'units',
        type: 'number',
        default: 1,
        description: 'Number of units',
      },
      {
        displayName: 'Charge Amount',
        name: 'chargeAmount',
        type: 'number',
        default: 0,
        description: 'Charge amount in dollars',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Pending Review', value: 'pending_review' },
          { name: 'Approved', value: 'approved' },
          { name: 'Ready to Bill', value: 'ready_to_bill' },
          { name: 'Hold', value: 'hold' },
        ],
        default: 'pending_review',
        description: 'Charge status',
      },
    ],
  },
  // Unbilled/Lag filters
  {
    displayName: 'Filter Options',
    name: 'filterOptions',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['chargeCapture'],
        operation: ['getUnbilledCharges', 'getChargeLag'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Facility ID',
        name: 'facilityId',
        type: 'string',
        default: '',
        description: 'Filter by facility',
      },
      {
        displayName: 'Provider NPI',
        name: 'providerNpi',
        type: 'string',
        default: '',
        description: 'Filter by provider',
      },
      {
        displayName: 'Department',
        name: 'department',
        type: 'string',
        default: '',
        description: 'Filter by department',
      },
      {
        displayName: 'Service Date Start',
        name: 'serviceDateStart',
        type: 'string',
        default: '',
        description: 'Start date for service date range (YYYY-MM-DD)',
      },
      {
        displayName: 'Service Date End',
        name: 'serviceDateEnd',
        type: 'string',
        default: '',
        description: 'End date for service date range (YYYY-MM-DD)',
      },
      {
        displayName: 'Days Threshold',
        name: 'daysThreshold',
        type: 'number',
        default: 3,
        description: 'Number of days for charge lag threshold',
      },
    ],
  },
];

export async function executeChargeCaptureOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let response: unknown;

  switch (operation) {
    case 'createCharge': {
      const encounterId = this.getNodeParameter('encounterId', index) as string;
      const chargeDetails = this.getNodeParameter('chargeDetails', index) as { charge?: Record<string, unknown> };

      const charge = chargeDetails.charge || {};
      // Parse modifiers and diagnosis codes if provided as strings
      if (typeof charge.modifiers === 'string' && charge.modifiers) {
        charge.modifiers = (charge.modifiers as string).split(',').map((m) => m.trim());
      }
      if (typeof charge.diagnosisCodes === 'string' && charge.diagnosisCodes) {
        charge.diagnosisCodes = (charge.diagnosisCodes as string).split(',').map((d) => d.trim());
      }

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: ENDPOINTS.CHARGE_CAPTURE.CREATE,
        body: {
          encounterId,
          ...charge,
        },
      });
      break;
    }

    case 'getCharge': {
      const chargeId = this.getNodeParameter('chargeId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.CHARGE_CAPTURE.GET}/${chargeId}`,
      });
      break;
    }

    case 'updateCharge': {
      const chargeId = this.getNodeParameter('chargeId', index) as string;
      const updateFields = this.getNodeParameter('updateFields', index, {}) as Record<string, unknown>;

      // Parse modifiers and diagnosis codes if provided as strings
      if (typeof updateFields.modifiers === 'string' && updateFields.modifiers) {
        updateFields.modifiers = (updateFields.modifiers as string).split(',').map((m) => m.trim());
      }
      if (typeof updateFields.diagnosisCodes === 'string' && updateFields.diagnosisCodes) {
        updateFields.diagnosisCodes = (updateFields.diagnosisCodes as string).split(',').map((d) => d.trim());
      }

      response = await r1RcmApiRequest(this, {
        method: 'PUT',
        endpoint: `${ENDPOINTS.CHARGE_CAPTURE.UPDATE}/${chargeId}`,
        body: updateFields,
      });
      break;
    }

    case 'deleteCharge': {
      const chargeId = this.getNodeParameter('chargeId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'DELETE',
        endpoint: `${ENDPOINTS.CHARGE_CAPTURE.DELETE}/${chargeId}`,
      });
      break;
    }

    case 'getChargesByEncounter': {
      const encounterId = this.getNodeParameter('encounterId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.CHARGE_CAPTURE.BY_ENCOUNTER}/${encounterId}`,
      });
      break;
    }

    case 'getChargesByPatient': {
      const patientId = this.getNodeParameter('patientId', index) as string;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.CHARGE_CAPTURE.BY_PATIENT}/${patientId}`,
      });
      break;
    }

    case 'getUnbilledCharges': {
      const filterOptions = this.getNodeParameter('filterOptions', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: ENDPOINTS.CHARGE_CAPTURE.UNBILLED,
        query: {
          facilityId: filterOptions.facilityId as string,
          providerNpi: filterOptions.providerNpi as string,
          department: filterOptions.department as string,
          serviceDateStart: filterOptions.serviceDateStart as string,
          serviceDateEnd: filterOptions.serviceDateEnd as string,
        },
      });
      break;
    }

    case 'getChargeLag': {
      const filterOptions = this.getNodeParameter('filterOptions', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.CHARGE_CAPTURE.LAG,
        query: {
          facilityId: filterOptions.facilityId as string,
          providerNpi: filterOptions.providerNpi as string,
          department: filterOptions.department as string,
          serviceDateStart: filterOptions.serviceDateStart as string,
          serviceDateEnd: filterOptions.serviceDateEnd as string,
          daysThreshold: filterOptions.daysThreshold as number,
        },
      });
      break;
    }

    default:
      throw new Error(`Operation ${operation} not supported`);
  }

  return [{ json: response as Record<string, unknown> }];
}
