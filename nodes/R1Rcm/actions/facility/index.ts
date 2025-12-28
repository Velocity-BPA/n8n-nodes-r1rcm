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

// Facility Resource Operations
export const facilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['facility'],
			},
		},
		options: [
			{
				name: 'Get Facility',
				value: 'getFacility',
				description: 'Retrieve a specific facility',
				action: 'Get a facility',
			},
			{
				name: 'Get Facilities',
				value: 'getFacilities',
				description: 'List all facilities',
				action: 'Get all facilities',
			},
			{
				name: 'Get Facility Performance',
				value: 'getFacilityPerformance',
				description: 'Get facility RCM performance metrics',
				action: 'Get facility performance',
			},
			{
				name: 'Get Facility Metrics',
				value: 'getFacilityMetrics',
				description: 'Get detailed facility metrics',
				action: 'Get facility metrics',
			},
			{
				name: 'Get Facility A/R',
				value: 'getFacilityAR',
				description: 'Get facility accounts receivable',
				action: 'Get facility A/R',
			},
		],
		default: 'getFacility',
	},
];

// Facility Resource Fields
export const facilityFields: INodeProperties[] = [
	// ----------------------------------
	//         getFacility
	// ----------------------------------
	{
		displayName: 'Facility ID',
		name: 'facilityId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['facility'],
				operation: ['getFacility'],
			},
		},
		default: '',
		description: 'The unique facility identifier',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['facility'],
				operation: ['getFacility'],
			},
		},
		options: [
			{
				displayName: 'Include Providers',
				name: 'includeProviders',
				type: 'boolean',
				default: false,
				description: 'Whether to include affiliated providers',
			},
			{
				displayName: 'Include Payers',
				name: 'includePayers',
				type: 'boolean',
				default: false,
				description: 'Whether to include contracted payers',
			},
			{
				displayName: 'Include Metrics',
				name: 'includeMetrics',
				type: 'boolean',
				default: false,
				description: 'Whether to include performance metrics',
			},
			{
				displayName: 'Include Contacts',
				name: 'includeContacts',
				type: 'boolean',
				default: true,
				description: 'Whether to include facility contacts',
			},
		],
	},

	// ----------------------------------
	//         getFacilities
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['facility'],
				operation: ['getFacilities'],
			},
		},
		options: [
			{
				displayName: 'Facility Type',
				name: 'facilityType',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Hospital', value: 'hospital' },
					{ name: 'Clinic', value: 'clinic' },
					{ name: 'Ambulatory Surgery Center', value: 'asc' },
					{ name: 'Skilled Nursing Facility', value: 'snf' },
					{ name: 'Urgent Care', value: 'urgentCare' },
					{ name: 'Physician Office', value: 'physicianOffice' },
					{ name: 'Imaging Center', value: 'imagingCenter' },
					{ name: 'Laboratory', value: 'laboratory' },
				],
				default: 'all',
				description: 'Type of facility',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Active', value: 'active' },
					{ name: 'Inactive', value: 'inactive' },
					{ name: 'Pending', value: 'pending' },
				],
				default: 'active',
				description: 'Facility status',
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'Filter by state code (e.g., CA, TX)',
			},
			{
				displayName: 'Region',
				name: 'region',
				type: 'string',
				default: '',
				description: 'Filter by region name',
			},
			{
				displayName: 'Organization ID',
				name: 'organizationId',
				type: 'string',
				default: '',
				description: 'Filter by parent organization',
			},
		],
	},

	// ----------------------------------
	//         getFacilityPerformance
	// ----------------------------------
	{
		displayName: 'Facility ID',
		name: 'facilityId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['facility'],
				operation: ['getFacilityPerformance'],
			},
		},
		default: '',
		description: 'Facility ID (leave empty for all facilities)',
	},
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'fixedCollection',
		default: {},
		displayOptions: {
			show: {
				resource: ['facility'],
				operation: ['getFacilityPerformance'],
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
				resource: ['facility'],
				operation: ['getFacilityPerformance'],
			},
		},
		options: [
			{ name: 'Gross Charges', value: 'grossCharges' },
			{ name: 'Net Revenue', value: 'netRevenue' },
			{ name: 'Collections', value: 'collections' },
			{ name: 'Denial Rate', value: 'denialRate' },
			{ name: 'Clean Claim Rate', value: 'cleanClaimRate' },
			{ name: 'Days in A/R', value: 'daysInAR' },
			{ name: 'Net Collection Rate', value: 'netCollectionRate' },
			{ name: 'Cash Collection Rate', value: 'cashCollectionRate' },
			{ name: 'Bad Debt Rate', value: 'badDebtRate' },
			{ name: 'Charity Care', value: 'charityCare' },
		],
		default: ['grossCharges', 'collections', 'denialRate', 'daysInAR'],
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
				resource: ['facility'],
				operation: ['getFacilityPerformance'],
			},
		},
		options: [
			{
				displayName: 'Compare to Prior Period',
				name: 'compareToPrior',
				type: 'boolean',
				default: true,
				description: 'Whether to compare to prior period',
			},
			{
				displayName: 'Compare to Budget',
				name: 'compareToBudget',
				type: 'boolean',
				default: false,
				description: 'Whether to compare to budget',
			},
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'options',
				options: [
					{ name: 'Facility', value: 'facility' },
					{ name: 'Department', value: 'department' },
					{ name: 'Service Line', value: 'serviceLine' },
					{ name: 'Day', value: 'day' },
					{ name: 'Week', value: 'week' },
					{ name: 'Month', value: 'month' },
				],
				default: 'facility',
				description: 'How to group performance data',
			},
		],
	},

	// ----------------------------------
	//         getFacilityMetrics
	// ----------------------------------
	{
		displayName: 'Facility ID',
		name: 'facilityId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['facility'],
				operation: ['getFacilityMetrics'],
			},
		},
		default: '',
		description: 'The facility ID',
	},
	{
		displayName: 'Metric Categories',
		name: 'metricCategories',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['facility'],
				operation: ['getFacilityMetrics'],
			},
		},
		options: [
			{ name: 'Revenue Cycle', value: 'revenueCycle' },
			{ name: 'Clinical', value: 'clinical' },
			{ name: 'Operational', value: 'operational' },
			{ name: 'Financial', value: 'financial' },
			{ name: 'Quality', value: 'quality' },
			{ name: 'Compliance', value: 'compliance' },
		],
		default: ['revenueCycle', 'financial'],
		description: 'Categories of metrics to retrieve',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['facility'],
				operation: ['getFacilityMetrics'],
			},
		},
		options: [
			{
				displayName: 'Time Period',
				name: 'timePeriod',
				type: 'options',
				options: [
					{ name: 'Current Month', value: 'currentMonth' },
					{ name: 'Last Month', value: 'lastMonth' },
					{ name: 'Current Quarter', value: 'currentQuarter' },
					{ name: 'Last Quarter', value: 'lastQuarter' },
					{ name: 'Year to Date', value: 'ytd' },
					{ name: 'Last 12 Months', value: 'trailing12' },
				],
				default: 'currentMonth',
				description: 'Time period for metrics',
			},
			{
				displayName: 'Include Trend',
				name: 'includeTrend',
				type: 'boolean',
				default: true,
				description: 'Whether to include trend data',
			},
			{
				displayName: 'Include Benchmark',
				name: 'includeBenchmark',
				type: 'boolean',
				default: true,
				description: 'Whether to include benchmark comparison',
			},
		],
	},

	// ----------------------------------
	//         getFacilityAR
	// ----------------------------------
	{
		displayName: 'Facility ID',
		name: 'facilityId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['facility'],
				operation: ['getFacilityAR'],
			},
		},
		default: '',
		description: 'The facility ID',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['facility'],
				operation: ['getFacilityAR'],
			},
		},
		options: [
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'options',
				options: [
					{ name: 'Aging Bucket', value: 'agingBucket' },
					{ name: 'Payer', value: 'payer' },
					{ name: 'Payer Type', value: 'payerType' },
					{ name: 'Service Line', value: 'serviceLine' },
					{ name: 'Department', value: 'department' },
				],
				default: 'agingBucket',
				description: 'How to group A/R data',
			},
			{
				displayName: 'Include Details',
				name: 'includeDetails',
				type: 'boolean',
				default: false,
				description: 'Whether to include claim-level details',
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
					{ name: 'Self-Pay', value: 'selfPay' },
					{ name: 'Workers Comp', value: 'workersComp' },
				],
				default: 'all',
				description: 'Filter by payer type',
			},
			{
				displayName: 'Minimum Balance',
				name: 'minimumBalance',
				type: 'number',
				default: 0,
				description: 'Minimum account balance to include',
			},
			{
				displayName: 'As of Date',
				name: 'asOfDate',
				type: 'dateTime',
				default: '',
				description: 'A/R as of this date (default: current)',
			},
		],
	},
];

// Execute Facility operations
export async function executeFacility(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;

	switch (operation) {
		case 'getFacility': {
			const facilityId = this.getNodeParameter('facilityId', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				includeProviders?: boolean;
				includePayers?: boolean;
				includeMetrics?: boolean;
				includeContacts?: boolean;
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
				`${ENDPOINTS.FACILITY.BASE}/${facilityId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getFacilities': {
			const filters = this.getNodeParameter('filters', index, {}) as {
				facilityType?: string;
				status?: string;
				state?: string;
				region?: string;
				organizationId?: string;
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
				`${ENDPOINTS.FACILITY.BASE}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getFacilityPerformance': {
			const facilityId = this.getNodeParameter('facilityId', index, '') as string;
			const dateRange = this.getNodeParameter('dateRange', index, {}) as {
				range?: { startDate?: string; endDate?: string };
			};
			const metrics = this.getNodeParameter('metrics', index, []) as string[];
			const options = this.getNodeParameter('options', index, {}) as {
				compareToPrior?: boolean;
				compareToBudget?: boolean;
				groupBy?: string;
			};

			const queryParams: Record<string, string | boolean> = {};
			if (facilityId) {
				queryParams.facilityId = facilityId;
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
				if (value !== undefined) {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.FACILITY.PERFORMANCE}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getFacilityMetrics': {
			const facilityId = this.getNodeParameter('facilityId', index) as string;
			const metricCategories = this.getNodeParameter('metricCategories', index, []) as string[];
			const options = this.getNodeParameter('options', index, {}) as {
				timePeriod?: string;
				includeTrend?: boolean;
				includeBenchmark?: boolean;
			};

			const queryParams: Record<string, string | boolean> = {};
			if (metricCategories.length > 0) {
				queryParams.categories = metricCategories.join(',');
			}
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.FACILITY.METRICS}/${facilityId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getFacilityAR': {
			const facilityId = this.getNodeParameter('facilityId', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				groupBy?: string;
				includeDetails?: boolean;
				payerType?: string;
				minimumBalance?: number;
				asOfDate?: string;
			};

			const queryParams: Record<string, string | boolean | number> = {};
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined && value !== 'all' && value !== 0) {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.FACILITY.AR}/${facilityId}`,
				{},
				queryParams,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for Facility`);
	}

	return this.helpers.returnJsonArray(responseData as object[]);
}
