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

export const denialOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['denial'],
      },
    },
    options: [
      { name: 'Get Denial', value: 'getDenial', action: 'Get denial details' },
      { name: 'Get Denials', value: 'getDenials', action: 'Get list of denials' },
      { name: 'Analyze Denial', value: 'analyzeDenial', action: 'Analyze denial with AI' },
      { name: 'Get Denial Reason', value: 'getDenialReason', action: 'Get denial reason details' },
      { name: 'Get Root Cause', value: 'getRootCause', action: 'Get root cause analysis' },
      { name: 'Create Appeal', value: 'createAppeal', action: 'Create denial appeal' },
      { name: 'Get Appeal Status', value: 'getAppealStatus', action: 'Get appeal status' },
      { name: 'Track Appeal', value: 'trackAppeal', action: 'Track appeal progress' },
      { name: 'Get Denial Trends', value: 'getDenialTrends', action: 'Get denial trend analytics' },
      { name: 'Get Prevention Recommendations', value: 'getPreventionRecommendations', action: 'Get denial prevention recommendations' },
    ],
    default: 'getDenial',
  },
];

export const denialFields: INodeProperties[] = [
  {
    displayName: 'Denial ID',
    name: 'denialId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['denial'],
        operation: ['getDenial', 'analyzeDenial', 'getDenialReason', 'getRootCause', 'createAppeal'],
      },
    },
    default: '',
    description: 'The unique identifier for the denial',
  },
  {
    displayName: 'Appeal ID',
    name: 'appealId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['denial'],
        operation: ['getAppealStatus', 'trackAppeal'],
      },
    },
    default: '',
    description: 'The unique identifier for the appeal',
  },
  // Get Denials filters
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['denial'],
        operation: ['getDenials'],
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
          { name: 'New', value: 'new' },
          { name: 'In Review', value: 'in_review' },
          { name: 'Appeal Pending', value: 'appeal_pending' },
          { name: 'Appealed', value: 'appealed' },
          { name: 'Resolved', value: 'resolved' },
          { name: 'Written Off', value: 'written_off' },
        ],
        default: 'all',
        description: 'Filter by denial status',
      },
      {
        displayName: 'Denial Category',
        name: 'denialCategory',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Clinical', value: 'clinical' },
          { name: 'Administrative', value: 'administrative' },
          { name: 'Technical', value: 'technical' },
          { name: 'Authorization', value: 'authorization' },
          { name: 'Eligibility', value: 'eligibility' },
          { name: 'Coding', value: 'coding' },
          { name: 'Duplicate', value: 'duplicate' },
          { name: 'Timely Filing', value: 'timely_filing' },
        ],
        default: 'all',
        description: 'Filter by denial category',
      },
      {
        displayName: 'Payer ID',
        name: 'payerId',
        type: 'string',
        default: '',
        description: 'Filter by payer',
      },
      {
        displayName: 'Date From',
        name: 'dateFrom',
        type: 'string',
        default: '',
        description: 'Denial date from (YYYY-MM-DD)',
      },
      {
        displayName: 'Date To',
        name: 'dateTo',
        type: 'string',
        default: '',
        description: 'Denial date to (YYYY-MM-DD)',
      },
      {
        displayName: 'Amount Min',
        name: 'amountMin',
        type: 'number',
        default: 0,
        description: 'Minimum denial amount',
      },
      {
        displayName: 'Amount Max',
        name: 'amountMax',
        type: 'number',
        default: 0,
        description: 'Maximum denial amount',
      },
      {
        displayName: 'Appealable Only',
        name: 'appealableOnly',
        type: 'boolean',
        default: false,
        description: 'Whether to only show appealable denials',
      },
    ],
  },
  // Create Appeal
  {
    displayName: 'Appeal Data',
    name: 'appealData',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['denial'],
        operation: ['createAppeal'],
      },
    },
    default: {},
    options: [
      {
        name: 'appeal',
        displayName: 'Appeal',
        values: [
          {
            displayName: 'Appeal Type',
            name: 'appealType',
            type: 'options',
            options: [
              { name: 'First Level', value: 'first_level' },
              { name: 'Second Level', value: 'second_level' },
              { name: 'External Review', value: 'external_review' },
              { name: 'Reconsideration', value: 'reconsideration' },
            ],
            default: 'first_level',
            description: 'Type of appeal',
          },
          {
            displayName: 'Appeal Reason',
            name: 'appealReason',
            type: 'string',
            typeOptions: {
              rows: 4,
            },
            default: '',
            description: 'Detailed reason for appeal',
          },
          {
            displayName: 'Supporting Documentation',
            name: 'supportingDocumentation',
            type: 'string',
            default: '',
            description: 'Description of supporting documentation',
          },
          {
            displayName: 'Requested Amount',
            name: 'requestedAmount',
            type: 'number',
            default: 0,
            description: 'Amount being appealed',
          },
          {
            displayName: 'Rush',
            name: 'rush',
            type: 'boolean',
            default: false,
            description: 'Whether to mark as rush priority',
          },
        ],
      },
    ],
    description: 'Appeal submission details',
  },
  // Trends filters
  {
    displayName: 'Trend Filters',
    name: 'trendFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['denial'],
        operation: ['getDenialTrends'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Date From',
        name: 'dateFrom',
        type: 'string',
        default: '',
        description: 'Start date (YYYY-MM-DD)',
      },
      {
        displayName: 'Date To',
        name: 'dateTo',
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
          { name: 'Category', value: 'category' },
          { name: 'Payer', value: 'payer' },
          { name: 'Provider', value: 'provider' },
          { name: 'Denial Code', value: 'denial_code' },
        ],
        default: 'month',
        description: 'How to group trend data',
      },
      {
        displayName: 'Include Root Causes',
        name: 'includeRootCauses',
        type: 'boolean',
        default: true,
        description: 'Whether to include root cause analysis',
      },
    ],
  },
  // Prevention filters
  {
    displayName: 'Prevention Scope',
    name: 'preventionScope',
    type: 'collection',
    placeholder: 'Add Scope',
    displayOptions: {
      show: {
        resource: ['denial'],
        operation: ['getPreventionRecommendations'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Scope',
        name: 'scope',
        type: 'options',
        options: [
          { name: 'Organization', value: 'organization' },
          { name: 'Facility', value: 'facility' },
          { name: 'Department', value: 'department' },
          { name: 'Provider', value: 'provider' },
          { name: 'Payer', value: 'payer' },
        ],
        default: 'organization',
        description: 'Scope for recommendations',
      },
      {
        displayName: 'Scope ID',
        name: 'scopeId',
        type: 'string',
        default: '',
        description: 'ID for the selected scope (required for facility/department/provider/payer)',
      },
      {
        displayName: 'Top N',
        name: 'topN',
        type: 'number',
        default: 10,
        description: 'Number of top recommendations to return',
      },
    ],
  },
];

export async function executeDenialOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let response: unknown;

  switch (operation) {
    case 'getDenial': {
      const denialId = this.getNodeParameter('denialId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.DENIAL.GET}/${denialId}`,
      });
      break;
    }

    case 'getDenials': {
      const filters = this.getNodeParameter('filters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DENIAL.LIST,
        query: {
          status: filters.status !== 'all' ? (filters.status as string) : undefined,
          denialCategory: filters.denialCategory !== 'all' ? (filters.denialCategory as string) : undefined,
          payerId: filters.payerId as string,
          dateFrom: filters.dateFrom as string,
          dateTo: filters.dateTo as string,
          amountMin: filters.amountMin as number,
          amountMax: filters.amountMax as number,
          appealableOnly: filters.appealableOnly as boolean,
        },
      });
      break;
    }

    case 'analyzeDenial': {
      const denialId = this.getNodeParameter('denialId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.DENIAL.ANALYZE}/${denialId}`,
      });
      break;
    }

    case 'getDenialReason': {
      const denialId = this.getNodeParameter('denialId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.DENIAL.REASON}/${denialId}`,
      });
      break;
    }

    case 'getRootCause': {
      const denialId = this.getNodeParameter('denialId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.DENIAL.ROOT_CAUSE}/${denialId}`,
      });
      break;
    }

    case 'createAppeal': {
      const denialId = this.getNodeParameter('denialId', index) as string;
      const appealData = this.getNodeParameter('appealData', index) as { appeal?: Record<string, unknown> };

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.DENIAL.APPEAL}/${denialId}`,
        body: appealData.appeal || {},
      });
      break;
    }

    case 'getAppealStatus': {
      const appealId = this.getNodeParameter('appealId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.DENIAL.APPEAL_STATUS}/${appealId}`,
      });
      break;
    }

    case 'trackAppeal': {
      const appealId = this.getNodeParameter('appealId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.DENIAL.APPEAL_TRACK}/${appealId}`,
      });
      break;
    }

    case 'getDenialTrends': {
      const trendFilters = this.getNodeParameter('trendFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DENIAL.TRENDS,
        query: {
          dateFrom: trendFilters.dateFrom as string,
          dateTo: trendFilters.dateTo as string,
          groupBy: trendFilters.groupBy as string,
          includeRootCauses: trendFilters.includeRootCauses as boolean,
        },
      });
      break;
    }

    case 'getPreventionRecommendations': {
      const preventionScope = this.getNodeParameter('preventionScope', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.DENIAL.PREVENTION,
        query: {
          scope: preventionScope.scope as string,
          scopeId: preventionScope.scopeId as string,
          topN: preventionScope.topN as number,
        },
      });
      break;
    }

    default:
      throw new Error(`Operation ${operation} not supported`);
  }

  return [{ json: response as Record<string, unknown> }];
}
