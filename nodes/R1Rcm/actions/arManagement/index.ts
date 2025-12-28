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

export const arManagementOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['arManagement'],
      },
    },
    options: [
      { name: 'Get A/R Aging', value: 'getArAging', action: 'Get A/R aging report' },
      { name: 'Get A/R by Payer', value: 'getArByPayer', action: 'Get A/R by payer' },
      { name: 'Get A/R by Facility', value: 'getArByFacility', action: 'Get A/R by facility' },
      { name: 'Get High Balance Accounts', value: 'getHighBalanceAccounts', action: 'Get high balance accounts' },
      { name: 'Get Follow-Up Queue', value: 'getFollowUpQueue', action: 'Get follow-up work queue' },
      { name: 'Assign Work', value: 'assignWork', action: 'Assign work item' },
      { name: 'Get Work Status', value: 'getWorkStatus', action: 'Get work item status' },
      { name: 'Update A/R Status', value: 'updateArStatus', action: 'Update A/R account status' },
      { name: 'Get Collection Queue', value: 'getCollectionQueue', action: 'Get collection queue' },
      { name: 'Get Bad Debt Queue', value: 'getBadDebtQueue', action: 'Get bad debt queue' },
    ],
    default: 'getArAging',
  },
];

export const arManagementFields: INodeProperties[] = [
  {
    displayName: 'Account ID',
    name: 'accountId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['arManagement'],
        operation: ['getWorkStatus', 'updateArStatus'],
      },
    },
    default: '',
    description: 'The account ID',
  },
  {
    displayName: 'Work Item ID',
    name: 'workItemId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['arManagement'],
        operation: ['assignWork'],
      },
    },
    default: '',
    description: 'The work item ID to assign',
  },
  // A/R Aging filters
  {
    displayName: 'Aging Filters',
    name: 'agingFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['arManagement'],
        operation: ['getArAging'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Aging Buckets',
        name: 'agingBuckets',
        type: 'multiOptions',
        options: [
          { name: '0-30 Days', value: '0-30' },
          { name: '31-60 Days', value: '31-60' },
          { name: '61-90 Days', value: '61-90' },
          { name: '91-120 Days', value: '91-120' },
          { name: '120+ Days', value: '120+' },
        ],
        default: [],
        description: 'Aging buckets to include',
      },
      {
        displayName: 'Payer Type',
        name: 'payerType',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Commercial', value: 'commercial' },
          { name: 'Medicare', value: 'medicare' },
          { name: 'Medicaid', value: 'medicaid' },
          { name: 'Self-Pay', value: 'self_pay' },
          { name: 'Workers Comp', value: 'workers_comp' },
        ],
        default: 'all',
        description: 'Filter by payer type',
      },
      {
        displayName: 'Facility ID',
        name: 'facilityId',
        type: 'string',
        default: '',
        description: 'Filter by facility',
      },
      {
        displayName: 'As of Date',
        name: 'asOfDate',
        type: 'string',
        default: '',
        description: 'A/R aging as of date (YYYY-MM-DD)',
      },
    ],
  },
  // Payer/Facility filters
  {
    displayName: 'Payer ID',
    name: 'payerId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['arManagement'],
        operation: ['getArByPayer'],
      },
    },
    default: '',
    description: 'The payer ID',
  },
  {
    displayName: 'Facility ID',
    name: 'facilityId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['arManagement'],
        operation: ['getArByFacility'],
      },
    },
    default: '',
    description: 'The facility ID',
  },
  // High Balance filters
  {
    displayName: 'High Balance Filters',
    name: 'highBalanceFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['arManagement'],
        operation: ['getHighBalanceAccounts'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Minimum Balance',
        name: 'minBalance',
        type: 'number',
        default: 10000,
        description: 'Minimum balance threshold',
      },
      {
        displayName: 'Account Type',
        name: 'accountType',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Insurance', value: 'insurance' },
          { name: 'Patient', value: 'patient' },
        ],
        default: 'all',
        description: 'Filter by account type',
      },
      {
        displayName: 'Days Outstanding Min',
        name: 'daysOutstandingMin',
        type: 'number',
        default: 0,
        description: 'Minimum days outstanding',
      },
    ],
  },
  // Follow-Up Queue filters
  {
    displayName: 'Queue Filters',
    name: 'queueFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['arManagement'],
        operation: ['getFollowUpQueue', 'getCollectionQueue', 'getBadDebtQueue'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Assigned To',
        name: 'assignedTo',
        type: 'string',
        default: '',
        description: 'Filter by assigned user',
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
      {
        displayName: 'Due Date From',
        name: 'dueDateFrom',
        type: 'string',
        default: '',
        description: 'Due date from (YYYY-MM-DD)',
      },
      {
        displayName: 'Due Date To',
        name: 'dueDateTo',
        type: 'string',
        default: '',
        description: 'Due date to (YYYY-MM-DD)',
      },
      {
        displayName: 'Payer ID',
        name: 'payerId',
        type: 'string',
        default: '',
        description: 'Filter by payer',
      },
      {
        displayName: 'Balance Min',
        name: 'balanceMin',
        type: 'number',
        default: 0,
        description: 'Minimum balance',
      },
    ],
  },
  // Assign Work
  {
    displayName: 'Assignment',
    name: 'assignment',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['arManagement'],
        operation: ['assignWork'],
      },
    },
    default: {},
    options: [
      {
        name: 'assign',
        displayName: 'Assignment',
        values: [
          {
            displayName: 'Assign To',
            name: 'assignTo',
            type: 'string',
            default: '',
            description: 'User ID to assign work to',
          },
          {
            displayName: 'Priority',
            name: 'priority',
            type: 'options',
            options: [
              { name: 'High', value: 'high' },
              { name: 'Medium', value: 'medium' },
              { name: 'Low', value: 'low' },
            ],
            default: 'medium',
            description: 'Work priority',
          },
          {
            displayName: 'Due Date',
            name: 'dueDate',
            type: 'string',
            default: '',
            description: 'Due date (YYYY-MM-DD)',
          },
          {
            displayName: 'Notes',
            name: 'notes',
            type: 'string',
            default: '',
            description: 'Assignment notes',
          },
        ],
      },
    ],
    description: 'Work assignment details',
  },
  // Update A/R Status
  {
    displayName: 'Status Update',
    name: 'statusUpdate',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['arManagement'],
        operation: ['updateArStatus'],
      },
    },
    default: {},
    options: [
      {
        name: 'update',
        displayName: 'Status Update',
        values: [
          {
            displayName: 'New Status',
            name: 'newStatus',
            type: 'options',
            options: [
              { name: 'Active', value: 'active' },
              { name: 'In Review', value: 'in_review' },
              { name: 'Pending Appeal', value: 'pending_appeal' },
              { name: 'Collections', value: 'collections' },
              { name: 'Payment Plan', value: 'payment_plan' },
              { name: 'Bad Debt', value: 'bad_debt' },
              { name: 'Write-Off', value: 'write_off' },
              { name: 'Resolved', value: 'resolved' },
            ],
            default: 'active',
            description: 'New account status',
          },
          {
            displayName: 'Reason',
            name: 'reason',
            type: 'string',
            default: '',
            description: 'Reason for status change',
          },
          {
            displayName: 'Follow-Up Date',
            name: 'followUpDate',
            type: 'string',
            default: '',
            description: 'Next follow-up date (YYYY-MM-DD)',
          },
          {
            displayName: 'Notes',
            name: 'notes',
            type: 'string',
            default: '',
            description: 'Status update notes',
          },
        ],
      },
    ],
    description: 'A/R status update details',
  },
];

export async function executeArManagementOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let response: unknown;

  switch (operation) {
    case 'getArAging': {
      const agingFilters = this.getNodeParameter('agingFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.AR_MANAGEMENT.AGING,
        query: {
          agingBuckets: (agingFilters.agingBuckets as string[])?.join(','),
          payerType: agingFilters.payerType !== 'all' ? (agingFilters.payerType as string) : undefined,
          facilityId: agingFilters.facilityId as string,
          asOfDate: agingFilters.asOfDate as string,
        },
      });
      break;
    }

    case 'getArByPayer': {
      const payerId = this.getNodeParameter('payerId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.AR_MANAGEMENT.BY_PAYER}/${payerId}`,
      });
      break;
    }

    case 'getArByFacility': {
      const facilityId = this.getNodeParameter('facilityId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.AR_MANAGEMENT.BY_FACILITY}/${facilityId}`,
      });
      break;
    }

    case 'getHighBalanceAccounts': {
      const highBalanceFilters = this.getNodeParameter('highBalanceFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: ENDPOINTS.AR_MANAGEMENT.HIGH_BALANCE,
        query: {
          minBalance: highBalanceFilters.minBalance as number,
          accountType: highBalanceFilters.accountType !== 'all' ? (highBalanceFilters.accountType as string) : undefined,
          daysOutstandingMin: highBalanceFilters.daysOutstandingMin as number,
        },
      });
      break;
    }

    case 'getFollowUpQueue': {
      const queueFilters = this.getNodeParameter('queueFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: ENDPOINTS.AR_MANAGEMENT.FOLLOW_UP,
        query: {
          assignedTo: queueFilters.assignedTo as string,
          priority: queueFilters.priority !== 'all' ? (queueFilters.priority as string) : undefined,
          dueDateFrom: queueFilters.dueDateFrom as string,
          dueDateTo: queueFilters.dueDateTo as string,
          payerId: queueFilters.payerId as string,
          balanceMin: queueFilters.balanceMin as number,
        },
      });
      break;
    }

    case 'assignWork': {
      const workItemId = this.getNodeParameter('workItemId', index) as string;
      const assignment = this.getNodeParameter('assignment', index) as { assign?: Record<string, unknown> };

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.AR_MANAGEMENT.ASSIGN}/${workItemId}`,
        body: assignment.assign || {},
      });
      break;
    }

    case 'getWorkStatus': {
      const accountId = this.getNodeParameter('accountId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.AR_MANAGEMENT.WORK_STATUS}/${accountId}`,
      });
      break;
    }

    case 'updateArStatus': {
      const accountId = this.getNodeParameter('accountId', index) as string;
      const statusUpdate = this.getNodeParameter('statusUpdate', index) as { update?: Record<string, unknown> };

      response = await r1RcmApiRequest(this, {
        method: 'PUT',
        endpoint: `${ENDPOINTS.AR_MANAGEMENT.UPDATE_STATUS}/${accountId}`,
        body: statusUpdate.update || {},
      });
      break;
    }

    case 'getCollectionQueue': {
      const queueFilters = this.getNodeParameter('queueFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: ENDPOINTS.AR_MANAGEMENT.COLLECTION,
        query: {
          assignedTo: queueFilters.assignedTo as string,
          priority: queueFilters.priority !== 'all' ? (queueFilters.priority as string) : undefined,
          dueDateFrom: queueFilters.dueDateFrom as string,
          dueDateTo: queueFilters.dueDateTo as string,
          balanceMin: queueFilters.balanceMin as number,
        },
      });
      break;
    }

    case 'getBadDebtQueue': {
      const queueFilters = this.getNodeParameter('queueFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: ENDPOINTS.AR_MANAGEMENT.BAD_DEBT,
        query: {
          assignedTo: queueFilters.assignedTo as string,
          priority: queueFilters.priority !== 'all' ? (queueFilters.priority as string) : undefined,
          balanceMin: queueFilters.balanceMin as number,
        },
      });
      break;
    }

    default:
      throw new Error(`Operation ${operation} not supported`);
  }

  return [{ json: response as Record<string, unknown> }];
}
