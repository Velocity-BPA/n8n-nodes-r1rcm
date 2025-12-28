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

export const codingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['coding'],
      },
    },
    options: [
      { name: 'Get Encounter for Coding', value: 'getEncounterForCoding', action: 'Get encounter for coding review' },
      { name: 'Submit Codes', value: 'submitCodes', action: 'Submit codes for encounter' },
      { name: 'Get Coding Status', value: 'getCodingStatus', action: 'Get coding status' },
      { name: 'Query Codes', value: 'queryCodes', action: 'Query diagnosis or procedure codes' },
      { name: 'Get Code Suggestions', value: 'getCodeSuggestions', action: 'Get AI code suggestions' },
      { name: 'Validate Codes', value: 'validateCodes', action: 'Validate code combinations' },
      { name: 'Get CCI Edits', value: 'getCCIEdits', action: 'Get CCI edit conflicts' },
      { name: 'Get LCD/NCD', value: 'getLcdNcd', action: 'Get local/national coverage determinations' },
      { name: 'Get Coding Queue', value: 'getCodingQueue', action: 'Get coding work queue' },
      { name: 'Get Coding Productivity', value: 'getCodingProductivity', action: 'Get coder productivity metrics' },
    ],
    default: 'getEncounterForCoding',
  },
];

export const codingFields: INodeProperties[] = [
  {
    displayName: 'Encounter ID',
    name: 'encounterId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['coding'],
        operation: ['getEncounterForCoding', 'submitCodes', 'getCodingStatus', 'getCodeSuggestions'],
      },
    },
    default: '',
    description: 'The encounter ID to code',
  },
  // Submit Codes
  {
    displayName: 'Coding Data',
    name: 'codingData',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['coding'],
        operation: ['submitCodes'],
      },
    },
    default: {},
    options: [
      {
        name: 'codes',
        displayName: 'Codes',
        values: [
          {
            displayName: 'Primary Diagnosis',
            name: 'primaryDiagnosis',
            type: 'string',
            default: '',
            description: 'Primary ICD-10 diagnosis code',
          },
          {
            displayName: 'Secondary Diagnoses',
            name: 'secondaryDiagnoses',
            type: 'string',
            default: '',
            description: 'Comma-separated secondary ICD-10 diagnosis codes',
          },
          {
            displayName: 'Procedure Codes',
            name: 'procedureCodes',
            type: 'string',
            default: '',
            description: 'Comma-separated CPT/HCPCS procedure codes',
          },
          {
            displayName: 'Modifiers',
            name: 'modifiers',
            type: 'string',
            default: '',
            description: 'Comma-separated modifiers to apply',
          },
          {
            displayName: 'DRG',
            name: 'drg',
            type: 'string',
            default: '',
            description: 'Diagnosis Related Group (for inpatient)',
          },
          {
            displayName: 'E&M Level',
            name: 'emLevel',
            type: 'options',
            options: [
              { name: 'N/A', value: '' },
              { name: '99211 - Level 1', value: '99211' },
              { name: '99212 - Level 2', value: '99212' },
              { name: '99213 - Level 3', value: '99213' },
              { name: '99214 - Level 4', value: '99214' },
              { name: '99215 - Level 5', value: '99215' },
            ],
            default: '',
            description: 'E&M service level',
          },
          {
            displayName: 'Coder Notes',
            name: 'coderNotes',
            type: 'string',
            default: '',
            description: 'Notes from the coder',
          },
        ],
      },
    ],
    description: 'Coding information to submit',
  },
  // Query Codes
  {
    displayName: 'Code Type',
    name: 'codeType',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['coding'],
        operation: ['queryCodes'],
      },
    },
    options: [
      { name: 'ICD-10 Diagnosis', value: 'icd10' },
      { name: 'CPT Procedure', value: 'cpt' },
      { name: 'HCPCS', value: 'hcpcs' },
      { name: 'ICD-10 PCS', value: 'icd10pcs' },
      { name: 'DRG', value: 'drg' },
    ],
    default: 'icd10',
    description: 'Type of code to query',
  },
  {
    displayName: 'Search Term',
    name: 'searchTerm',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['coding'],
        operation: ['queryCodes'],
      },
    },
    default: '',
    description: 'Code or description to search for',
  },
  // Validate Codes
  {
    displayName: 'Validation Request',
    name: 'validationRequest',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['coding'],
        operation: ['validateCodes'],
      },
    },
    default: {},
    options: [
      {
        name: 'validation',
        displayName: 'Validation',
        values: [
          {
            displayName: 'Diagnosis Codes',
            name: 'diagnosisCodes',
            type: 'string',
            default: '',
            description: 'Comma-separated diagnosis codes to validate',
          },
          {
            displayName: 'Procedure Codes',
            name: 'procedureCodes',
            type: 'string',
            default: '',
            description: 'Comma-separated procedure codes to validate',
          },
          {
            displayName: 'Modifiers',
            name: 'modifiers',
            type: 'string',
            default: '',
            description: 'Comma-separated modifiers',
          },
          {
            displayName: 'Age',
            name: 'age',
            type: 'number',
            default: 0,
            description: 'Patient age for age-specific validation',
          },
          {
            displayName: 'Gender',
            name: 'gender',
            type: 'options',
            options: [
              { name: 'Male', value: 'M' },
              { name: 'Female', value: 'F' },
              { name: 'Unknown', value: 'U' },
            ],
            default: 'U',
            description: 'Patient gender for gender-specific validation',
          },
        ],
      },
    ],
    description: 'Codes to validate',
  },
  // CCI Edits
  {
    displayName: 'CCI Check',
    name: 'cciCheck',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['coding'],
        operation: ['getCCIEdits'],
      },
    },
    default: {},
    options: [
      {
        name: 'cci',
        displayName: 'CCI Check',
        values: [
          {
            displayName: 'Procedure Code 1',
            name: 'procedureCode1',
            type: 'string',
            default: '',
            description: 'First procedure code',
          },
          {
            displayName: 'Procedure Code 2',
            name: 'procedureCode2',
            type: 'string',
            default: '',
            description: 'Second procedure code to check against first',
          },
        ],
      },
    ],
    description: 'Check for Correct Coding Initiative (CCI) edit conflicts',
  },
  // LCD/NCD
  {
    displayName: 'Coverage Query',
    name: 'coverageQuery',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['coding'],
        operation: ['getLcdNcd'],
      },
    },
    default: {},
    options: [
      {
        name: 'coverage',
        displayName: 'Coverage Query',
        values: [
          {
            displayName: 'Procedure Code',
            name: 'procedureCode',
            type: 'string',
            default: '',
            description: 'Procedure code to check coverage for',
          },
          {
            displayName: 'Diagnosis Code',
            name: 'diagnosisCode',
            type: 'string',
            default: '',
            description: 'Supporting diagnosis code',
          },
          {
            displayName: 'MAC Region',
            name: 'macRegion',
            type: 'string',
            default: '',
            description: 'Medicare Administrative Contractor region (for LCD)',
          },
        ],
      },
    ],
    description: 'Query Local or National Coverage Determinations',
  },
  // Queue filters
  {
    displayName: 'Queue Filters',
    name: 'queueFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['coding'],
        operation: ['getCodingQueue'],
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
          { name: 'On Hold', value: 'on_hold' },
          { name: 'Query', value: 'query' },
        ],
        default: 'all',
        description: 'Filter by coding status',
      },
      {
        displayName: 'Assigned To',
        name: 'assignedTo',
        type: 'string',
        default: '',
        description: 'Filter by assigned coder ID',
      },
      {
        displayName: 'Service Type',
        name: 'serviceType',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Inpatient', value: 'inpatient' },
          { name: 'Outpatient', value: 'outpatient' },
          { name: 'Professional', value: 'professional' },
          { name: 'Emergency', value: 'emergency' },
        ],
        default: 'all',
        description: 'Filter by service type',
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
        description: 'Filter by priority',
      },
    ],
  },
  // Productivity filters
  {
    displayName: 'Productivity Filters',
    name: 'productivityFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['coding'],
        operation: ['getCodingProductivity'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Coder ID',
        name: 'coderId',
        type: 'string',
        default: '',
        description: 'Filter by specific coder',
      },
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
      {
        displayName: 'Group By',
        name: 'groupBy',
        type: 'options',
        options: [
          { name: 'Day', value: 'day' },
          { name: 'Week', value: 'week' },
          { name: 'Month', value: 'month' },
          { name: 'Coder', value: 'coder' },
        ],
        default: 'day',
        description: 'Group productivity metrics by',
      },
    ],
  },
];

export async function executeCodingOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let response: unknown;

  switch (operation) {
    case 'getEncounterForCoding': {
      const encounterId = this.getNodeParameter('encounterId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.CODING.ENCOUNTER}/${encounterId}`,
      });
      break;
    }

    case 'submitCodes': {
      const encounterId = this.getNodeParameter('encounterId', index) as string;
      const codingData = this.getNodeParameter('codingData', index) as { codes?: Record<string, unknown> };
      const codes = codingData.codes || {};

      // Parse comma-separated values
      if (typeof codes.secondaryDiagnoses === 'string' && codes.secondaryDiagnoses) {
        codes.secondaryDiagnoses = (codes.secondaryDiagnoses as string).split(',').map((c) => c.trim());
      }
      if (typeof codes.procedureCodes === 'string' && codes.procedureCodes) {
        codes.procedureCodes = (codes.procedureCodes as string).split(',').map((c) => c.trim());
      }
      if (typeof codes.modifiers === 'string' && codes.modifiers) {
        codes.modifiers = (codes.modifiers as string).split(',').map((c) => c.trim());
      }

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: ENDPOINTS.CODING.SUBMIT,
        body: {
          encounterId,
          ...codes,
        },
      });
      break;
    }

    case 'getCodingStatus': {
      const encounterId = this.getNodeParameter('encounterId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.CODING.STATUS}/${encounterId}`,
      });
      break;
    }

    case 'queryCodes': {
      const codeType = this.getNodeParameter('codeType', index) as string;
      const searchTerm = this.getNodeParameter('searchTerm', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.CODING.QUERY,
        query: {
          codeType,
          searchTerm,
        },
      });
      break;
    }

    case 'getCodeSuggestions': {
      const encounterId = this.getNodeParameter('encounterId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.CODING.SUGGESTIONS}/${encounterId}`,
      });
      break;
    }

    case 'validateCodes': {
      const validationRequest = this.getNodeParameter('validationRequest', index) as { validation?: Record<string, unknown> };
      const validation = validationRequest.validation || {};

      // Parse comma-separated values
      if (typeof validation.diagnosisCodes === 'string' && validation.diagnosisCodes) {
        validation.diagnosisCodes = (validation.diagnosisCodes as string).split(',').map((c) => c.trim());
      }
      if (typeof validation.procedureCodes === 'string' && validation.procedureCodes) {
        validation.procedureCodes = (validation.procedureCodes as string).split(',').map((c) => c.trim());
      }
      if (typeof validation.modifiers === 'string' && validation.modifiers) {
        validation.modifiers = (validation.modifiers as string).split(',').map((c) => c.trim());
      }

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: ENDPOINTS.CODING.VALIDATE,
        body: validation,
      });
      break;
    }

    case 'getCCIEdits': {
      const cciCheck = this.getNodeParameter('cciCheck', index) as { cci?: { procedureCode1?: string; procedureCode2?: string } };

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.CODING.CCI_EDITS,
        query: {
          procedureCode1: cciCheck.cci?.procedureCode1,
          procedureCode2: cciCheck.cci?.procedureCode2,
        },
      });
      break;
    }

    case 'getLcdNcd': {
      const coverageQuery = this.getNodeParameter('coverageQuery', index) as { coverage?: Record<string, unknown> };

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.CODING.LCD_NCD,
        query: {
          procedureCode: coverageQuery.coverage?.procedureCode as string,
          diagnosisCode: coverageQuery.coverage?.diagnosisCode as string,
          macRegion: coverageQuery.coverage?.macRegion as string,
        },
      });
      break;
    }

    case 'getCodingQueue': {
      const queueFilters = this.getNodeParameter('queueFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: ENDPOINTS.CODING.QUEUE,
        query: {
          status: queueFilters.status !== 'all' ? (queueFilters.status as string) : undefined,
          assignedTo: queueFilters.assignedTo as string,
          serviceType: queueFilters.serviceType !== 'all' ? (queueFilters.serviceType as string) : undefined,
          priority: queueFilters.priority !== 'all' ? (queueFilters.priority as string) : undefined,
        },
      });
      break;
    }

    case 'getCodingProductivity': {
      const productivityFilters = this.getNodeParameter('productivityFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.CODING.PRODUCTIVITY,
        query: {
          coderId: productivityFilters.coderId as string,
          startDate: productivityFilters.startDate as string,
          endDate: productivityFilters.endDate as string,
          groupBy: productivityFilters.groupBy as string,
        },
      });
      break;
    }

    default:
      throw new Error(`Operation ${operation} not supported`);
  }

  return [{ json: response as Record<string, unknown> }];
}
