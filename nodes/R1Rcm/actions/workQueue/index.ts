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
import { WORK_QUEUE_TYPES } from '../../constants/workQueues';

export const workQueueOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['workQueue'],
      },
    },
    options: [
      { name: 'Get Work Queues', value: 'getWorkQueues', action: 'Get all work queues' },
      { name: 'Get Queue Items', value: 'getQueueItems', action: 'Get items in a queue' },
      { name: 'Assign Work Item', value: 'assignWorkItem', action: 'Assign work item to user' },
      { name: 'Complete Work Item', value: 'completeWorkItem', action: 'Complete a work item' },
      { name: 'Transfer Work Item', value: 'transferWorkItem', action: 'Transfer work item' },
      { name: 'Get Queue Metrics', value: 'getQueueMetrics', action: 'Get queue performance metrics' },
      { name: 'Get Queue by Type', value: 'getQueueByType', action: 'Get queue by type' },
      { name: 'Get User Work', value: 'getUserWork', action: 'Get work assigned to user' },
      { name: 'Get Queue SLA', value: 'getQueueSLA', action: 'Get queue SLA status' },
    ],
    default: 'getWorkQueues',
  },
];

export const workQueueFields: INodeProperties[] = [
  {
    displayName: 'Queue ID',
    name: 'queueId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['workQueue'],
        operation: ['getQueueItems', 'getQueueMetrics', 'getQueueSLA'],
      },
    },
    default: '',
    description: 'The queue ID',
  },
  {
    displayName: 'Work Item ID',
    name: 'workItemId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['workQueue'],
        operation: ['assignWorkItem', 'completeWorkItem', 'transferWorkItem'],
      },
    },
    default: '',
    description: 'The work item ID',
  },
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['workQueue'],
        operation: ['getUserWork'],
      },
    },
    default: '',
    description: 'The user ID',
  },
  {
    displayName: 'Queue Type',
    name: 'queueType',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['workQueue'],
        operation: ['getQueueByType'],
      },
    },
    options: Object.entries(WORK_QUEUE_TYPES).map(([key, value]) => ({
      name: value.name,
      value: key,
    })),
    default: 'REGISTRATION',
    description: 'Type of work queue',
  },
  // Queue Items filters
  {
    displayName: 'Item Filters',
    name: 'itemFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['workQueue'],
        operation: ['getQueueItems'],
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
          { name: 'On Hold', value: 'on_hold' },
          { name: 'Completed', value: 'completed' },
        ],
        default: 'all',
        description: 'Filter by item status',
      },
      {
        displayName: 'Priority',
        name: 'priority',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Critical', value: '1' },
          { name: 'High', value: '2' },
          { name: 'Medium', value: '3' },
          { name: 'Low', value: '4' },
          { name: 'Minimal', value: '5' },
        ],
        default: 'all',
        description: 'Filter by priority',
      },
      {
        displayName: 'Assigned To',
        name: 'assignedTo',
        type: 'string',
        default: '',
        description: 'Filter by assigned user',
      },
      {
        displayName: 'Due Before',
        name: 'dueBefore',
        type: 'string',
        default: '',
        description: 'Filter items due before date (YYYY-MM-DD)',
      },
      {
        displayName: 'SLA Breached',
        name: 'slaBreached',
        type: 'boolean',
        default: false,
        description: 'Whether to only show SLA breached items',
      },
    ],
  },
  // Assign Work Item
  {
    displayName: 'Assignment Details',
    name: 'assignmentDetails',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['workQueue'],
        operation: ['assignWorkItem'],
      },
    },
    default: {},
    options: [
      {
        name: 'assignment',
        displayName: 'Assignment',
        values: [
          {
            displayName: 'Assign To User',
            name: 'assignToUser',
            type: 'string',
            default: '',
            description: 'User ID to assign work to',
          },
          {
            displayName: 'Priority Override',
            name: 'priorityOverride',
            type: 'options',
            options: [
              { name: 'Keep Current', value: '' },
              { name: 'Critical', value: '1' },
              { name: 'High', value: '2' },
              { name: 'Medium', value: '3' },
              { name: 'Low', value: '4' },
              { name: 'Minimal', value: '5' },
            ],
            default: '',
            description: 'Override priority level',
          },
          {
            displayName: 'Due Date Override',
            name: 'dueDateOverride',
            type: 'string',
            default: '',
            description: 'Override due date (YYYY-MM-DD)',
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
    description: 'Work item assignment details',
  },
  // Complete Work Item
  {
    displayName: 'Completion Details',
    name: 'completionDetails',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['workQueue'],
        operation: ['completeWorkItem'],
      },
    },
    default: {},
    options: [
      {
        name: 'completion',
        displayName: 'Completion',
        values: [
          {
            displayName: 'Resolution',
            name: 'resolution',
            type: 'options',
            options: [
              { name: 'Resolved', value: 'resolved' },
              { name: 'Unable to Resolve', value: 'unable_to_resolve' },
              { name: 'Escalated', value: 'escalated' },
              { name: 'No Action Needed', value: 'no_action' },
              { name: 'Duplicate', value: 'duplicate' },
            ],
            default: 'resolved',
            description: 'Resolution type',
          },
          {
            displayName: 'Resolution Notes',
            name: 'resolutionNotes',
            type: 'string',
            typeOptions: {
              rows: 3,
            },
            default: '',
            description: 'Notes about the resolution',
          },
          {
            displayName: 'Follow-Up Required',
            name: 'followUpRequired',
            type: 'boolean',
            default: false,
            description: 'Whether follow-up is required',
          },
          {
            displayName: 'Follow-Up Date',
            name: 'followUpDate',
            type: 'string',
            default: '',
            description: 'Follow-up date if required (YYYY-MM-DD)',
          },
        ],
      },
    ],
    description: 'Work item completion details',
  },
  // Transfer Work Item
  {
    displayName: 'Transfer Details',
    name: 'transferDetails',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['workQueue'],
        operation: ['transferWorkItem'],
      },
    },
    default: {},
    options: [
      {
        name: 'transfer',
        displayName: 'Transfer',
        values: [
          {
            displayName: 'Target Queue',
            name: 'targetQueue',
            type: 'string',
            default: '',
            description: 'Queue ID to transfer to',
          },
          {
            displayName: 'Transfer Reason',
            name: 'transferReason',
            type: 'options',
            options: [
              { name: 'Reassignment', value: 'reassignment' },
              { name: 'Escalation', value: 'escalation' },
              { name: 'Wrong Queue', value: 'wrong_queue' },
              { name: 'Specialization', value: 'specialization' },
              { name: 'Workload Balance', value: 'workload_balance' },
            ],
            default: 'reassignment',
            description: 'Reason for transfer',
          },
          {
            displayName: 'Transfer Notes',
            name: 'transferNotes',
            type: 'string',
            default: '',
            description: 'Notes about the transfer',
          },
        ],
      },
    ],
    description: 'Work item transfer details',
  },
  // User Work filters
  {
    displayName: 'User Work Filters',
    name: 'userWorkFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['workQueue'],
        operation: ['getUserWork'],
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
          { name: 'On Hold', value: 'on_hold' },
        ],
        default: 'all',
        description: 'Filter by status',
      },
      {
        displayName: 'Queue Type',
        name: 'queueType',
        type: 'string',
        default: '',
        description: 'Filter by queue type',
      },
      {
        displayName: 'Due Today Only',
        name: 'dueTodayOnly',
        type: 'boolean',
        default: false,
        description: 'Whether to only show items due today',
      },
    ],
  },
];

export async function executeWorkQueueOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let response: unknown;

  switch (operation) {
    case 'getWorkQueues': {
      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.WORK_QUEUE.LIST,
      });
      break;
    }

    case 'getQueueItems': {
      const queueId = this.getNodeParameter('queueId', index) as string;
      const itemFilters = this.getNodeParameter('itemFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.WORK_QUEUE.ITEMS}/${queueId}`,
        query: {
          status: itemFilters.status !== 'all' ? (itemFilters.status as string) : undefined,
          priority: itemFilters.priority !== 'all' ? (itemFilters.priority as string) : undefined,
          assignedTo: itemFilters.assignedTo as string,
          dueBefore: itemFilters.dueBefore as string,
          slaBreached: itemFilters.slaBreached as boolean,
        },
      });
      break;
    }

    case 'assignWorkItem': {
      const workItemId = this.getNodeParameter('workItemId', index) as string;
      const assignmentDetails = this.getNodeParameter('assignmentDetails', index) as { assignment?: Record<string, unknown> };

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.WORK_QUEUE.ASSIGN}/${workItemId}`,
        body: assignmentDetails.assignment || {},
      });
      break;
    }

    case 'completeWorkItem': {
      const workItemId = this.getNodeParameter('workItemId', index) as string;
      const completionDetails = this.getNodeParameter('completionDetails', index) as { completion?: Record<string, unknown> };

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.WORK_QUEUE.COMPLETE}/${workItemId}`,
        body: completionDetails.completion || {},
      });
      break;
    }

    case 'transferWorkItem': {
      const workItemId = this.getNodeParameter('workItemId', index) as string;
      const transferDetails = this.getNodeParameter('transferDetails', index) as { transfer?: Record<string, unknown> };

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.WORK_QUEUE.TRANSFER}/${workItemId}`,
        body: transferDetails.transfer || {},
      });
      break;
    }

    case 'getQueueMetrics': {
      const queueId = this.getNodeParameter('queueId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.WORK_QUEUE.METRICS}/${queueId}`,
      });
      break;
    }

    case 'getQueueByType': {
      const queueType = this.getNodeParameter('queueType', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.WORK_QUEUE.BY_TYPE,
        query: { type: queueType },
      });
      break;
    }

    case 'getUserWork': {
      const userId = this.getNodeParameter('userId', index) as string;
      const userWorkFilters = this.getNodeParameter('userWorkFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.WORK_QUEUE.USER_WORK}/${userId}`,
        query: {
          status: userWorkFilters.status !== 'all' ? (userWorkFilters.status as string) : undefined,
          queueType: userWorkFilters.queueType as string,
          dueTodayOnly: userWorkFilters.dueTodayOnly as boolean,
        },
      });
      break;
    }

    case 'getQueueSLA': {
      const queueId = this.getNodeParameter('queueId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.WORK_QUEUE.SLA}/${queueId}`,
      });
      break;
    }

    default:
      throw new Error(`Operation ${operation} not supported`);
  }

  return [{ json: response as Record<string, unknown> }];
}
