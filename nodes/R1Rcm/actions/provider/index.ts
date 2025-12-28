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

// Provider Resource Operations
export const providerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['provider'],
			},
		},
		options: [
			{
				name: 'Get Provider',
				value: 'getProvider',
				description: 'Retrieve a specific provider',
				action: 'Get a provider',
			},
			{
				name: 'Search Providers',
				value: 'searchProviders',
				description: 'Search for providers',
				action: 'Search providers',
			},
			{
				name: 'Get Provider Credentials',
				value: 'getProviderCredentials',
				description: 'Get provider credentialing status',
				action: 'Get provider credentials',
			},
			{
				name: 'Get Provider Performance',
				value: 'getProviderPerformance',
				description: 'Get provider RCM performance metrics',
				action: 'Get provider performance',
			},
			{
				name: 'Get Provider Productivity',
				value: 'getProviderProductivity',
				description: 'Get provider productivity metrics',
				action: 'Get provider productivity',
			},
			{
				name: 'Validate NPI',
				value: 'validateNpi',
				description: 'Validate provider NPI number',
				action: 'Validate NPI',
			},
			{
				name: 'Get Enrolled Providers',
				value: 'getEnrolledProviders',
				description: 'Get providers enrolled with a payer',
				action: 'Get enrolled providers',
			},
		],
		default: 'getProvider',
	},
];

// Provider Resource Fields
export const providerFields: INodeProperties[] = [
	// ----------------------------------
	//         getProvider
	// ----------------------------------
	{
		displayName: 'Provider ID',
		name: 'providerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getProvider'],
			},
		},
		default: '',
		description: 'The provider ID or NPI',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getProvider'],
			},
		},
		options: [
			{
				displayName: 'Include Credentials',
				name: 'includeCredentials',
				type: 'boolean',
				default: false,
				description: 'Whether to include credentialing information',
			},
			{
				displayName: 'Include Facilities',
				name: 'includeFacilities',
				type: 'boolean',
				default: false,
				description: 'Whether to include facility affiliations',
			},
			{
				displayName: 'Include Enrollments',
				name: 'includeEnrollments',
				type: 'boolean',
				default: false,
				description: 'Whether to include payer enrollments',
			},
			{
				displayName: 'Include Specialties',
				name: 'includeSpecialties',
				type: 'boolean',
				default: true,
				description: 'Whether to include specialty information',
			},
		],
	},

	// ----------------------------------
	//         searchProviders
	// ----------------------------------
	{
		displayName: 'Search Criteria',
		name: 'searchCriteria',
		type: 'collection',
		placeholder: 'Add Criteria',
		default: {},
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['searchProviders'],
			},
		},
		options: [
			{
				displayName: 'NPI',
				name: 'npi',
				type: 'string',
				default: '',
				description: 'National Provider Identifier',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'Provider last name',
			},
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'Provider first name',
			},
			{
				displayName: 'Specialty',
				name: 'specialty',
				type: 'string',
				default: '',
				description: 'Provider specialty or taxonomy code',
			},
			{
				displayName: 'Facility ID',
				name: 'facilityId',
				type: 'string',
				default: '',
				description: 'Filter by facility affiliation',
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
				description: 'Provider status',
			},
			{
				displayName: 'Provider Type',
				name: 'providerType',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Individual', value: 'individual' },
					{ name: 'Organization', value: 'organization' },
				],
				default: 'all',
				description: 'Type of provider',
			},
		],
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['searchProviders'],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		default: 50,
		description: 'Maximum number of providers to return',
	},

	// ----------------------------------
	//         getProviderCredentials
	// ----------------------------------
	{
		displayName: 'Provider ID',
		name: 'providerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getProviderCredentials'],
			},
		},
		default: '',
		description: 'The provider ID or NPI',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getProviderCredentials'],
			},
		},
		options: [
			{
				displayName: 'Credential Type',
				name: 'credentialType',
				type: 'multiOptions',
				options: [
					{ name: 'Board Certification', value: 'boardCertification' },
					{ name: 'State License', value: 'stateLicense' },
					{ name: 'DEA', value: 'dea' },
					{ name: 'Hospital Privileges', value: 'hospitalPrivileges' },
					{ name: 'Insurance Enrollment', value: 'insuranceEnrollment' },
					{ name: 'Malpractice', value: 'malpractice' },
				],
				default: [],
				description: 'Types of credentials to retrieve',
			},
			{
				displayName: 'Include Expired',
				name: 'includeExpired',
				type: 'boolean',
				default: false,
				description: 'Whether to include expired credentials',
			},
			{
				displayName: 'Expiring Within Days',
				name: 'expiringWithinDays',
				type: 'number',
				default: 0,
				description: 'Flag credentials expiring within this many days',
			},
		],
	},

	// ----------------------------------
	//         getProviderPerformance
	// ----------------------------------
	{
		displayName: 'Provider ID',
		name: 'providerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getProviderPerformance'],
			},
		},
		default: '',
		description: 'The provider ID or NPI',
	},
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'fixedCollection',
		default: {},
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getProviderPerformance'],
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
				resource: ['provider'],
				operation: ['getProviderPerformance'],
			},
		},
		options: [
			{ name: 'Charges', value: 'charges' },
			{ name: 'Collections', value: 'collections' },
			{ name: 'Denial Rate', value: 'denialRate' },
			{ name: 'Clean Claim Rate', value: 'cleanClaimRate' },
			{ name: 'Days in A/R', value: 'daysInAR' },
			{ name: 'Net Collection Rate', value: 'netCollectionRate' },
			{ name: 'RVU Production', value: 'rvuProduction' },
			{ name: 'Coding Accuracy', value: 'codingAccuracy' },
		],
		default: ['charges', 'collections', 'denialRate'],
		description: 'Performance metrics to include',
	},

	// ----------------------------------
	//         getProviderProductivity
	// ----------------------------------
	{
		displayName: 'Provider ID',
		name: 'providerId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getProviderProductivity'],
			},
		},
		default: '',
		description: 'Provider ID (leave empty for all providers)',
	},
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'fixedCollection',
		default: {},
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getProviderProductivity'],
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
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getProviderProductivity'],
			},
		},
		options: [
			{
				displayName: 'Facility ID',
				name: 'facilityId',
				type: 'string',
				default: '',
				description: 'Filter by facility',
			},
			{
				displayName: 'Specialty',
				name: 'specialty',
				type: 'string',
				default: '',
				description: 'Filter by specialty',
			},
			{
				displayName: 'Compare to Benchmark',
				name: 'compareToBenchmark',
				type: 'boolean',
				default: true,
				description: 'Whether to include benchmark comparison',
			},
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'options',
				options: [
					{ name: 'Provider', value: 'provider' },
					{ name: 'Specialty', value: 'specialty' },
					{ name: 'Facility', value: 'facility' },
					{ name: 'Day', value: 'day' },
					{ name: 'Week', value: 'week' },
					{ name: 'Month', value: 'month' },
				],
				default: 'provider',
				description: 'How to group productivity data',
			},
		],
	},

	// ----------------------------------
	//         validateNpi
	// ----------------------------------
	{
		displayName: 'NPI',
		name: 'npi',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['validateNpi'],
			},
		},
		default: '',
		description: 'The 10-digit NPI to validate',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['validateNpi'],
			},
		},
		options: [
			{
				displayName: 'Check NPPES Registry',
				name: 'checkNppes',
				type: 'boolean',
				default: true,
				description: 'Whether to verify against NPPES national registry',
			},
			{
				displayName: 'Include Provider Details',
				name: 'includeDetails',
				type: 'boolean',
				default: true,
				description: 'Whether to include provider details from registry',
			},
		],
	},

	// ----------------------------------
	//         getEnrolledProviders
	// ----------------------------------
	{
		displayName: 'Payer ID',
		name: 'payerId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getEnrolledProviders'],
			},
		},
		default: '',
		description: 'The payer ID to get enrolled providers for',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['provider'],
				operation: ['getEnrolledProviders'],
			},
		},
		options: [
			{
				displayName: 'Facility ID',
				name: 'facilityId',
				type: 'string',
				default: '',
				description: 'Filter by facility',
			},
			{
				displayName: 'Enrollment Status',
				name: 'enrollmentStatus',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Active', value: 'active' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Inactive', value: 'inactive' },
					{ name: 'Terminated', value: 'terminated' },
				],
				default: 'active',
				description: 'Enrollment status filter',
			},
			{
				displayName: 'Specialty',
				name: 'specialty',
				type: 'string',
				default: '',
				description: 'Filter by specialty',
			},
			{
				displayName: 'Include Effective Dates',
				name: 'includeEffectiveDates',
				type: 'boolean',
				default: true,
				description: 'Whether to include enrollment effective dates',
			},
		],
	},
];

// Execute Provider operations
export async function executeProvider(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;

	switch (operation) {
		case 'getProvider': {
			const providerId = this.getNodeParameter('providerId', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				includeCredentials?: boolean;
				includeFacilities?: boolean;
				includeEnrollments?: boolean;
				includeSpecialties?: boolean;
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
				`${ENDPOINTS.PROVIDER.BASE}/${providerId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'searchProviders': {
			const searchCriteria = this.getNodeParameter('searchCriteria', index, {}) as {
				npi?: string;
				lastName?: string;
				firstName?: string;
				specialty?: string;
				facilityId?: string;
				status?: string;
				providerType?: string;
			};
			const limit = this.getNodeParameter('limit', index, 50) as number;

			const queryParams: Record<string, string | number> = { limit };
			Object.entries(searchCriteria).forEach(([key, value]) => {
				if (value && value !== 'all') {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PROVIDER.SEARCH}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getProviderCredentials': {
			const providerId = this.getNodeParameter('providerId', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				credentialType?: string[];
				includeExpired?: boolean;
				expiringWithinDays?: number;
			};

			const queryParams: Record<string, string | boolean | number> = {};
			if (options.credentialType && options.credentialType.length > 0) {
				queryParams.types = options.credentialType.join(',');
			}
			if (options.includeExpired !== undefined) {
				queryParams.includeExpired = options.includeExpired;
			}
			if (options.expiringWithinDays) {
				queryParams.expiringWithinDays = options.expiringWithinDays;
			}

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PROVIDER.CREDENTIALS}/${providerId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getProviderPerformance': {
			const providerId = this.getNodeParameter('providerId', index) as string;
			const dateRange = this.getNodeParameter('dateRange', index, {}) as {
				range?: { startDate?: string; endDate?: string };
			};
			const metrics = this.getNodeParameter('metrics', index, []) as string[];

			const queryParams: Record<string, string> = {};
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
				`${ENDPOINTS.PROVIDER.PERFORMANCE}/${providerId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getProviderProductivity': {
			const providerId = this.getNodeParameter('providerId', index, '') as string;
			const dateRange = this.getNodeParameter('dateRange', index, {}) as {
				range?: { startDate?: string; endDate?: string };
			};
			const options = this.getNodeParameter('options', index, {}) as {
				facilityId?: string;
				specialty?: string;
				compareToBenchmark?: boolean;
				groupBy?: string;
			};

			const queryParams: Record<string, string | boolean> = {};
			if (providerId) {
				queryParams.providerId = providerId;
			}
			if (dateRange.range) {
				if (dateRange.range.startDate) {
					queryParams.startDate = dateRange.range.startDate;
				}
				if (dateRange.range.endDate) {
					queryParams.endDate = dateRange.range.endDate;
				}
			}
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined && value !== '') {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PROVIDER.PRODUCTIVITY}`,
				{},
				queryParams,
			);
			break;
		}

		case 'validateNpi': {
			const npi = this.getNodeParameter('npi', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				checkNppes?: boolean;
				includeDetails?: boolean;
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
				`${ENDPOINTS.PROVIDER.VALIDATE_NPI}/${npi}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getEnrolledProviders': {
			const payerId = this.getNodeParameter('payerId', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				facilityId?: string;
				enrollmentStatus?: string;
				specialty?: string;
				includeEffectiveDates?: boolean;
			};

			const queryParams: Record<string, string | boolean> = { payerId };
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined && value !== 'all' && value !== '') {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.PROVIDER.ENROLLED}`,
				{},
				queryParams,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for Provider`);
	}

	return this.helpers.returnJsonArray(responseData as object[]);
}
