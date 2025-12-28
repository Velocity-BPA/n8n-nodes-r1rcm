/* Copyright (c) Velocity BPA, LLC. Licensed under the Business Source License 1.1.
 * See LICENSE file for details. Commercial use requires a separate license from Velocity BPA.
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { r1RcmApiRequest } from '../../transport/r1RcmClient';
import { ENDPOINTS } from '../../constants/endpoints';

// Automation Resource Operations
export const automationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['automation'],
			},
		},
		options: [
			{
				name: 'Get Automation Rules',
				value: 'getAutomationRules',
				description: 'List all automation rules',
				action: 'Get automation rules',
			},
			{
				name: 'Create Automation Rule',
				value: 'createAutomationRule',
				description: 'Create a new automation rule',
				action: 'Create automation rule',
			},
			{
				name: 'Update Automation Rule',
				value: 'updateAutomationRule',
				description: 'Update an existing automation rule',
				action: 'Update automation rule',
			},
			{
				name: 'Get Automation Status',
				value: 'getAutomationStatus',
				description: 'Get status of automation jobs',
				action: 'Get automation status',
			},
			{
				name: 'Get Bot Performance',
				value: 'getBotPerformance',
				description: 'Get RPA bot performance metrics',
				action: 'Get bot performance',
			},
			{
				name: 'Get Automation Queue',
				value: 'getAutomationQueue',
				description: 'Get automation work queue',
				action: 'Get automation queue',
			},
			{
				name: 'Get Intelligent Automation',
				value: 'getIntelligentAutomation',
				description: 'Get AI/ML-powered automation insights',
				action: 'Get intelligent automation',
			},
		],
		default: 'getAutomationRules',
	},
];

// Automation Resource Fields
export const automationFields: INodeProperties[] = [
	// ----------------------------------
	//         getAutomationRules
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['getAutomationRules'],
			},
		},
		options: [
			{
				displayName: 'Rule Type',
				name: 'ruleType',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Eligibility', value: 'eligibility' },
					{ name: 'Prior Auth', value: 'priorAuth' },
					{ name: 'Claim Submission', value: 'claimSubmission' },
					{ name: 'Denial Management', value: 'denialManagement' },
					{ name: 'Payment Posting', value: 'paymentPosting' },
					{ name: 'A/R Follow-up', value: 'arFollowup' },
					{ name: 'Patient Collections', value: 'patientCollections' },
				],
				default: 'all',
				description: 'Type of automation rule',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
					{ name: 'Draft', value: 'draft' },
				],
				default: 'active',
				description: 'Rule status',
			},
			{
				displayName: 'Facility ID',
				name: 'facilityId',
				type: 'string',
				default: '',
				description: 'Filter by facility',
			},
		],
	},

	// ----------------------------------
	//         createAutomationRule
	// ----------------------------------
	{
		displayName: 'Rule Name',
		name: 'ruleName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['createAutomationRule'],
			},
		},
		default: '',
		description: 'Name for the automation rule',
	},
	{
		displayName: 'Rule Type',
		name: 'ruleType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['createAutomationRule'],
			},
		},
		options: [
			{ name: 'Eligibility Check', value: 'eligibility' },
			{ name: 'Prior Authorization', value: 'priorAuth' },
			{ name: 'Claim Submission', value: 'claimSubmission' },
			{ name: 'Denial Work', value: 'denialManagement' },
			{ name: 'Payment Posting', value: 'paymentPosting' },
			{ name: 'A/R Follow-up', value: 'arFollowup' },
			{ name: 'Patient Collections', value: 'patientCollections' },
			{ name: 'Status Check', value: 'statusCheck' },
		],
		default: 'eligibility',
		description: 'Type of automation',
	},
	{
		displayName: 'Trigger',
		name: 'trigger',
		type: 'fixedCollection',
		default: {},
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['createAutomationRule'],
			},
		},
		options: [
			{
				name: 'triggerConfig',
				displayName: 'Trigger Configuration',
				values: [
					{
						displayName: 'Trigger Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Event', value: 'event' },
							{ name: 'Schedule', value: 'schedule' },
							{ name: 'Condition', value: 'condition' },
						],
						default: 'event',
					},
					{
						displayName: 'Event Name',
						name: 'eventName',
						type: 'string',
						default: '',
						description: 'Event that triggers the rule',
					},
					{
						displayName: 'Schedule (Cron)',
						name: 'schedule',
						type: 'string',
						default: '',
						description: 'Cron expression for scheduled triggers',
					},
				],
			},
		],
	},
	{
		displayName: 'Conditions',
		name: 'conditions',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['createAutomationRule'],
			},
		},
		default: '[]',
		description: 'JSON array of conditions for the rule',
	},
	{
		displayName: 'Actions',
		name: 'actions',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['createAutomationRule'],
			},
		},
		default: '[]',
		description: 'JSON array of actions to perform',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['createAutomationRule'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the rule',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				default: 5,
				description: 'Rule priority (1-10, 1 = highest)',
			},
			{
				displayName: 'Facility IDs',
				name: 'facilityIds',
				type: 'string',
				default: '',
				description: 'Comma-separated facility IDs to apply rule to',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'When the rule becomes active',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'When the rule expires',
			},
			{
				displayName: 'Activate Immediately',
				name: 'activateImmediately',
				type: 'boolean',
				default: false,
				description: 'Whether to activate the rule immediately',
			},
		],
	},

	// ----------------------------------
	//         updateAutomationRule
	// ----------------------------------
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['updateAutomationRule'],
			},
		},
		default: '',
		description: 'The rule ID to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['updateAutomationRule'],
			},
		},
		options: [
			{
				displayName: 'Rule Name',
				name: 'ruleName',
				type: 'string',
				default: '',
				description: 'New name for the rule',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
					{ name: 'Draft', value: 'draft' },
				],
				default: 'active',
				description: 'Rule status',
			},
			{
				displayName: 'Conditions',
				name: 'conditions',
				type: 'json',
				default: '',
				description: 'Updated conditions',
			},
			{
				displayName: 'Actions',
				name: 'actions',
				type: 'json',
				default: '',
				description: 'Updated actions',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'number',
				default: 5,
				description: 'Rule priority',
			},
		],
	},

	// ----------------------------------
	//         getAutomationStatus
	// ----------------------------------
	{
		displayName: 'Status Type',
		name: 'statusType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['getAutomationStatus'],
			},
		},
		options: [
			{ name: 'All Jobs', value: 'all' },
			{ name: 'Running', value: 'running' },
			{ name: 'Completed', value: 'completed' },
			{ name: 'Failed', value: 'failed' },
			{ name: 'Queued', value: 'queued' },
		],
		default: 'all',
		description: 'Status of jobs to retrieve',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['getAutomationStatus'],
			},
		},
		options: [
			{
				displayName: 'Rule ID',
				name: 'ruleId',
				type: 'string',
				default: '',
				description: 'Filter by specific rule',
			},
			{
				displayName: 'Job ID',
				name: 'jobId',
				type: 'string',
				default: '',
				description: 'Get specific job status',
			},
			{
				displayName: 'Since',
				name: 'since',
				type: 'dateTime',
				default: '',
				description: 'Jobs since this date',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Maximum jobs to return',
			},
		],
	},

	// ----------------------------------
	//         getBotPerformance
	// ----------------------------------
	{
		displayName: 'Bot ID',
		name: 'botId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['getBotPerformance'],
			},
		},
		default: '',
		description: 'Bot ID (leave empty for all bots)',
	},
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'fixedCollection',
		default: {},
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['getBotPerformance'],
			},
		},
		options: [
			{
				name: 'range',
				displayName: 'Date Range',
				values: [
					{
						displayName: 'Start Date',
						name: 'startDate',
						type: 'dateTime',
						default: '',
					},
					{
						displayName: 'End Date',
						name: 'endDate',
						type: 'dateTime',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: 'Metrics',
		name: 'metrics',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['getBotPerformance'],
			},
		},
		options: [
			{ name: 'Tasks Completed', value: 'tasksCompleted' },
			{ name: 'Success Rate', value: 'successRate' },
			{ name: 'Average Duration', value: 'avgDuration' },
			{ name: 'Error Rate', value: 'errorRate' },
			{ name: 'Utilization', value: 'utilization' },
			{ name: 'Cost Savings', value: 'costSavings' },
			{ name: 'FTE Equivalent', value: 'fteEquivalent' },
		],
		default: ['tasksCompleted', 'successRate', 'costSavings'],
		description: 'Performance metrics to include',
	},

	// ----------------------------------
	//         getAutomationQueue
	// ----------------------------------
	{
		displayName: 'Queue Type',
		name: 'queueType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['getAutomationQueue'],
			},
		},
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Pending', value: 'pending' },
			{ name: 'In Progress', value: 'inProgress' },
			{ name: 'Failed', value: 'failed' },
			{ name: 'Retry', value: 'retry' },
		],
		default: 'pending',
		description: 'Queue status to retrieve',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['getAutomationQueue'],
			},
		},
		options: [
			{
				displayName: 'Rule Type',
				name: 'ruleType',
				type: 'string',
				default: '',
				description: 'Filter by automation type',
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
				],
				default: 'all',
				description: 'Filter by priority',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Maximum items to return',
			},
		],
	},

	// ----------------------------------
	//         getIntelligentAutomation
	// ----------------------------------
	{
		displayName: 'Insight Type',
		name: 'insightType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['getIntelligentAutomation'],
			},
		},
		options: [
			{ name: 'Denial Prediction', value: 'denialPrediction' },
			{ name: 'Payment Prediction', value: 'paymentPrediction' },
			{ name: 'Coding Suggestions', value: 'codingSuggestions' },
			{ name: 'Work Prioritization', value: 'workPrioritization' },
			{ name: 'Automation Opportunities', value: 'automationOpportunities' },
			{ name: 'Risk Assessment', value: 'riskAssessment' },
		],
		default: 'denialPrediction',
		description: 'Type of AI insight to retrieve',
	},
	{
		displayName: 'Context',
		name: 'context',
		type: 'collection',
		placeholder: 'Add Context',
		default: {},
		displayOptions: {
			show: {
				resource: ['automation'],
				operation: ['getIntelligentAutomation'],
			},
		},
		options: [
			{
				displayName: 'Claim ID',
				name: 'claimId',
				type: 'string',
				default: '',
				description: 'Claim ID for predictions',
			},
			{
				displayName: 'Encounter ID',
				name: 'encounterId',
				type: 'string',
				default: '',
				description: 'Encounter ID for coding suggestions',
			},
			{
				displayName: 'Payer ID',
				name: 'payerId',
				type: 'string',
				default: '',
				description: 'Payer ID for payer-specific insights',
			},
			{
				displayName: 'Facility ID',
				name: 'facilityId',
				type: 'string',
				default: '',
				description: 'Facility ID for facility-specific insights',
			},
		],
	},
];

// Execute Automation operations
export async function executeAutomation(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;

	switch (operation) {
		case 'getAutomationRules': {
			const filters = this.getNodeParameter('filters', index, {}) as {
				ruleType?: string;
				status?: string;
				facilityId?: string;
			};

			const queryParams: Record<string, string> = {};
			Object.entries(filters).forEach(([key, value]) => {
				if (value && value !== 'all') {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.AUTOMATION.RULES}`,
				{},
				queryParams,
			);
			break;
		}

		case 'createAutomationRule': {
			const ruleName = this.getNodeParameter('ruleName', index) as string;
			const ruleType = this.getNodeParameter('ruleType', index) as string;
			const trigger = this.getNodeParameter('trigger', index, {}) as {
				triggerConfig?: { type?: string; eventName?: string; schedule?: string };
			};
			const conditions = this.getNodeParameter('conditions', index, '[]') as string;
			const actions = this.getNodeParameter('actions', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				description?: string;
				priority?: number;
				facilityIds?: string;
				startDate?: string;
				endDate?: string;
				activateImmediately?: boolean;
			};

			const body: Record<string, unknown> = {
				name: ruleName,
				type: ruleType,
				trigger: trigger.triggerConfig || {},
				conditions: JSON.parse(conditions),
				actions: JSON.parse(actions),
				...options,
			};

			if (options.facilityIds) {
				body.facilityIds = options.facilityIds.split(',').map(id => id.trim());
			}

			responseData = await r1RcmApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.AUTOMATION.RULES}`,
				body,
			);
			break;
		}

		case 'updateAutomationRule': {
			const ruleId = this.getNodeParameter('ruleId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index, {}) as {
				ruleName?: string;
				status?: string;
				conditions?: string;
				actions?: string;
				priority?: number;
			};

			const body: Record<string, unknown> = {};
			Object.entries(updateFields).forEach(([key, value]) => {
				if (value !== undefined && value !== '') {
					if (key === 'conditions' || key === 'actions') {
						body[key] = JSON.parse(value as string);
					} else {
						body[key] = value;
					}
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'PATCH',
				`${ENDPOINTS.AUTOMATION.RULES}/${ruleId}`,
				body,
			);
			break;
		}

		case 'getAutomationStatus': {
			const statusType = this.getNodeParameter('statusType', index, 'all') as string;
			const options = this.getNodeParameter('options', index, {}) as {
				ruleId?: string;
				jobId?: string;
				since?: string;
				limit?: number;
			};

			const queryParams: Record<string, string | number> = {};
			if (statusType !== 'all') {
				queryParams.status = statusType;
			}
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined && value !== '') {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.AUTOMATION.STATUS}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getBotPerformance': {
			const botId = this.getNodeParameter('botId', index, '') as string;
			const dateRange = this.getNodeParameter('dateRange', index, {}) as {
				range?: { startDate?: string; endDate?: string };
			};
			const metrics = this.getNodeParameter('metrics', index, []) as string[];

			const queryParams: Record<string, string> = {};
			if (botId) {
				queryParams.botId = botId;
			}
			if (dateRange.range) {
				if (dateRange.range.startDate) {
					queryParams.startDate = dateRange.range.startDate;
				}
				if (dateRange.range.endDate) {
					queryParams.endDate = dateRange.range.endDate;
				}
			}
			if (metrics.length > 0) {
				queryParams.metrics = metrics.join(',');
			}

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.AUTOMATION.BOTS}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getAutomationQueue': {
			const queueType = this.getNodeParameter('queueType', index, 'pending') as string;
			const options = this.getNodeParameter('options', index, {}) as {
				ruleType?: string;
				priority?: string;
				limit?: number;
			};

			const queryParams: Record<string, string | number> = {};
			if (queueType !== 'all') {
				queryParams.status = queueType;
			}
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined && value !== 'all' && value !== '') {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.AUTOMATION.QUEUE}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getIntelligentAutomation': {
			const insightType = this.getNodeParameter('insightType', index) as string;
			const context = this.getNodeParameter('context', index, {}) as {
				claimId?: string;
				encounterId?: string;
				payerId?: string;
				facilityId?: string;
			};

			const body = {
				insightType,
				...context,
			};

			responseData = await r1RcmApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.AUTOMATION.INTELLIGENT}`,
				body,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for Automation`);
	}

	return this.helpers.returnJsonArray(responseData as object[]);
}
