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

// Payer Resource Operations
export const payerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['payer'],
			},
		},
		options: [
			{
				name: 'Get Payer',
				value: 'getPayer',
				description: 'Retrieve a specific payer',
				action: 'Get a payer',
			},
			{
				name: 'Get Payers',
				value: 'getPayers',
				description: 'List all payers',
				action: 'Get all payers',
			},
			{
				name: 'Get Payer Rules',
				value: 'getPayerRules',
				description: 'Get payer-specific billing rules',
				action: 'Get payer rules',
			},
			{
				name: 'Get Payer Performance',
				value: 'getPayerPerformance',
				description: 'Get payer performance metrics',
				action: 'Get payer performance',
			},
			{
				name: 'Get Payer Trends',
				value: 'getPayerTrends',
				description: 'Get payer trends over time',
				action: 'Get payer trends',
			},
			{
				name: 'Get Payer Contacts',
				value: 'getPayerContacts',
				description: 'Get payer contact information',
				action: 'Get payer contacts',
			},
			{
				name: 'Check Payer Status',
				value: 'checkPayerStatus',
				description: 'Check payer connectivity and status',
				action: 'Check payer status',
			},
		],
		default: 'getPayer',
	},
];

// Payer Resource Fields
export const payerFields: INodeProperties[] = [
	// ----------------------------------
	//         getPayer
	// ----------------------------------
	{
		displayName: 'Payer ID',
		name: 'payerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayer'],
			},
		},
		default: '',
		description: 'The unique payer identifier',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayer'],
			},
		},
		options: [
			{
				displayName: 'Include Contracts',
				name: 'includeContracts',
				type: 'boolean',
				default: false,
				description: 'Whether to include contract information',
			},
			{
				displayName: 'Include Rules',
				name: 'includeRules',
				type: 'boolean',
				default: false,
				description: 'Whether to include billing rules',
			},
			{
				displayName: 'Include Contacts',
				name: 'includeContacts',
				type: 'boolean',
				default: true,
				description: 'Whether to include contact information',
			},
			{
				displayName: 'Include EDI Info',
				name: 'includeEdiInfo',
				type: 'boolean',
				default: false,
				description: 'Whether to include EDI configuration',
			},
		],
	},

	// ----------------------------------
	//         getPayers
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayers'],
			},
		},
		options: [
			{
				displayName: 'Payer Type',
				name: 'payerType',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Commercial', value: 'commercial' },
					{ name: 'Medicare', value: 'medicare' },
					{ name: 'Medicaid', value: 'medicaid' },
					{ name: 'Workers Comp', value: 'workersComp' },
					{ name: 'Auto', value: 'auto' },
					{ name: 'Tricare', value: 'tricare' },
					{ name: 'VA', value: 'va' },
				],
				default: 'all',
				description: 'Type of payer',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
				],
				default: 'active',
				description: 'Payer status',
			},
			{
				displayName: 'Has Contract',
				name: 'hasContract',
				type: 'boolean',
				default: false,
				description: 'Whether to filter to payers with active contracts',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'Filter by state code',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search by payer name',
			},
		],
	},

	// ----------------------------------
	//         getPayerRules
	// ----------------------------------
	{
		displayName: 'Payer ID',
		name: 'payerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayerRules'],
			},
		},
		default: '',
		description: 'The payer ID',
	},
	{
		displayName: 'Rule Category',
		name: 'ruleCategory',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayerRules'],
			},
		},
		options: [
			{ name: 'All Rules', value: 'all' },
			{ name: 'Authorization', value: 'authorization' },
			{ name: 'Billing', value: 'billing' },
			{ name: 'Timely Filing', value: 'timelyFiling' },
			{ name: 'Coding', value: 'coding' },
			{ name: 'Modifiers', value: 'modifiers' },
			{ name: 'Claims', value: 'claims' },
			{ name: 'Appeals', value: 'appeals' },
		],
		default: 'all',
		description: 'Category of rules to retrieve',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayerRules'],
			},
		},
		options: [
			{
				displayName: 'Procedure Code',
				name: 'procedureCode',
				type: 'string',
				default: '',
				description: 'Get rules specific to this procedure code',
			},
			{
				displayName: 'Place of Service',
				name: 'placeOfService',
				type: 'string',
				default: '',
				description: 'Filter by place of service',
			},
			{
				displayName: 'Include Exceptions',
				name: 'includeExceptions',
				type: 'boolean',
				default: true,
				description: 'Whether to include rule exceptions',
			},
		],
	},

	// ----------------------------------
	//         getPayerPerformance
	// ----------------------------------
	{
		displayName: 'Payer ID',
		name: 'payerId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayerPerformance'],
			},
		},
		default: '',
		description: 'Payer ID (leave empty for all payers)',
	},
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'fixedCollection',
		default: {},
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayerPerformance'],
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
				resource: ['payer'],
				operation: ['getPayerPerformance'],
			},
		},
		options: [
			{ name: 'Total Claims', value: 'totalClaims' },
			{ name: 'Paid Claims', value: 'paidClaims' },
			{ name: 'Denied Claims', value: 'deniedClaims' },
			{ name: 'Denial Rate', value: 'denialRate' },
			{ name: 'Average Days to Pay', value: 'avgDaysToPay' },
			{ name: 'Collections', value: 'collections' },
			{ name: 'Net Collection Rate', value: 'netCollectionRate' },
			{ name: 'Contract Compliance', value: 'contractCompliance' },
			{ name: 'Underpayment Rate', value: 'underpaymentRate' },
			{ name: 'First Pass Rate', value: 'firstPassRate' },
		],
		default: ['denialRate', 'avgDaysToPay', 'collections'],
		description: 'Performance metrics to include',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayerPerformance'],
			},
		},
		options: [
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'options',
				options: [
					{ name: 'Payer', value: 'payer' },
					{ name: 'Payer Type', value: 'payerType' },
					{ name: 'Facility', value: 'facility' },
					{ name: 'Month', value: 'month' },
				],
				default: 'payer',
				description: 'How to group results',
			},
			{
				displayName: 'Facility ID',
				name: 'facilityId',
				type: 'string',
				default: '',
				description: 'Filter by facility',
			},
			{
				displayName: 'Compare to Prior Period',
				name: 'compareToPrior',
				type: 'boolean',
				default: false,
				description: 'Whether to include prior period comparison',
			},
		],
	},

	// ----------------------------------
	//         getPayerTrends
	// ----------------------------------
	{
		displayName: 'Payer ID',
		name: 'payerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayerTrends'],
			},
		},
		default: '',
		description: 'The payer ID',
	},
	{
		displayName: 'Trend Metrics',
		name: 'trendMetrics',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayerTrends'],
			},
		},
		options: [
			{ name: 'Denial Rate', value: 'denialRate' },
			{ name: 'Payment Turnaround', value: 'paymentTurnaround' },
			{ name: 'Collections', value: 'collections' },
			{ name: 'Claim Volume', value: 'claimVolume' },
			{ name: 'Underpayments', value: 'underpayments' },
			{ name: 'Appeal Success Rate', value: 'appealSuccessRate' },
		],
		default: ['denialRate', 'paymentTurnaround'],
		description: 'Metrics to trend',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayerTrends'],
			},
		},
		options: [
			{
				displayName: 'Time Period',
				name: 'timePeriod',
				type: 'options',
				options: [
					{ name: 'Last 3 Months', value: '3months' },
					{ name: 'Last 6 Months', value: '6months' },
					{ name: 'Last 12 Months', value: '12months' },
					{ name: 'Last 24 Months', value: '24months' },
				],
				default: '12months',
				description: 'Time period for trend analysis',
			},
			{
				displayName: 'Granularity',
				name: 'granularity',
				type: 'options',
				options: [
					{ name: 'Weekly', value: 'weekly' },
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'Quarterly', value: 'quarterly' },
				],
				default: 'monthly',
				description: 'Data point frequency',
			},
			{
				displayName: 'Include Forecast',
				name: 'includeForecast',
				type: 'boolean',
				default: false,
				description: 'Whether to include trend forecast',
			},
		],
	},

	// ----------------------------------
	//         getPayerContacts
	// ----------------------------------
	{
		displayName: 'Payer ID',
		name: 'payerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayerContacts'],
			},
		},
		default: '',
		description: 'The payer ID',
	},
	{
		displayName: 'Contact Type',
		name: 'contactType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['getPayerContacts'],
			},
		},
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Provider Relations', value: 'providerRelations' },
			{ name: 'Claims', value: 'claims' },
			{ name: 'Appeals', value: 'appeals' },
			{ name: 'Authorization', value: 'authorization' },
			{ name: 'EDI/Technical', value: 'edi' },
			{ name: 'Contracting', value: 'contracting' },
		],
		default: 'all',
		description: 'Type of contact to retrieve',
	},

	// ----------------------------------
	//         checkPayerStatus
	// ----------------------------------
	{
		displayName: 'Payer ID',
		name: 'payerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['checkPayerStatus'],
			},
		},
		default: '',
		description: 'The payer ID to check',
	},
	{
		displayName: 'Check Types',
		name: 'checkTypes',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['payer'],
				operation: ['checkPayerStatus'],
			},
		},
		options: [
			{ name: 'Eligibility (270/271)', value: 'eligibility' },
			{ name: 'Claim Status (276/277)', value: 'claimStatus' },
			{ name: 'Claim Submission (837)', value: 'claimSubmission' },
			{ name: 'Remittance (835)', value: 'remittance' },
			{ name: 'Prior Auth (278)', value: 'priorAuth' },
		],
		default: ['eligibility', 'claimSubmission'],
		description: 'Types of connectivity to check',
	},
];

// Execute Payer operations
export async function executePayer(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;

	switch (operation) {
		case 'getPayer': {
			const payerId = this.getNodeParameter('payerId', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				includeContracts?: boolean;
				includeRules?: boolean;
				includeContacts?: boolean;
				includeEdiInfo?: boolean;
			};

			const queryParams: Record<string, boolean> = {};
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PAYER.BASE}/${payerId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getPayers': {
			const filters = this.getNodeParameter('filters', index, {}) as {
				payerType?: string;
				status?: string;
				hasContract?: boolean;
				state?: string;
				search?: string;
			};

			const queryParams: Record<string, string | boolean> = {};
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined && value !== 'all' && value !== '') {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PAYER.BASE}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getPayerRules': {
			const payerId = this.getNodeParameter('payerId', index) as string;
			const ruleCategory = this.getNodeParameter('ruleCategory', index, 'all') as string;
			const options = this.getNodeParameter('options', index, {}) as {
				procedureCode?: string;
				placeOfService?: string;
				includeExceptions?: boolean;
			};

			const queryParams: Record<string, string | boolean> = {};
			if (ruleCategory !== 'all') {
				queryParams.category = ruleCategory;
			}
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined && value !== '') {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PAYER.RULES}/${payerId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getPayerPerformance': {
			const payerId = this.getNodeParameter('payerId', index, '') as string;
			const dateRange = this.getNodeParameter('dateRange', index, {}) as {
				range?: { startDate?: string; endDate?: string };
			};
			const metrics = this.getNodeParameter('metrics', index, []) as string[];
			const options = this.getNodeParameter('options', index, {}) as {
				groupBy?: string;
				facilityId?: string;
				compareToPrior?: boolean;
			};

			const queryParams: Record<string, string | boolean> = {};
			if (payerId) {
				queryParams.payerId = payerId;
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
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined && value !== '') {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PAYER.PERFORMANCE}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getPayerTrends': {
			const payerId = this.getNodeParameter('payerId', index) as string;
			const trendMetrics = this.getNodeParameter('trendMetrics', index, []) as string[];
			const options = this.getNodeParameter('options', index, {}) as {
				timePeriod?: string;
				granularity?: string;
				includeForecast?: boolean;
			};

			const queryParams: Record<string, string | boolean> = {};
			if (trendMetrics.length > 0) {
				queryParams.metrics = trendMetrics.join(',');
			}
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PAYER.TRENDS}/${payerId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getPayerContacts': {
			const payerId = this.getNodeParameter('payerId', index) as string;
			const contactType = this.getNodeParameter('contactType', index, 'all') as string;

			const queryParams: Record<string, string> = {};
			if (contactType !== 'all') {
				queryParams.type = contactType;
			}

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PAYER.CONTACTS}/${payerId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'checkPayerStatus': {
			const payerId = this.getNodeParameter('payerId', index) as string;
			const checkTypes = this.getNodeParameter('checkTypes', index, []) as string[];

			const body = {
				payerId,
				checkTypes,
			};

			responseData = await r1RcmApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.PAYER.STATUS}`,
				body,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for Payer`);
	}

	return this.helpers.returnJsonArray(responseData as object[]);
}
