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

// Contract Resource Operations
export const contractOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['contract'],
			},
		},
		options: [
			{
				name: 'Get Contract',
				value: 'getContract',
				description: 'Retrieve a specific payer contract',
				action: 'Get a payer contract',
			},
			{
				name: 'Get Contracts',
				value: 'getContracts',
				description: 'List all payer contracts',
				action: 'Get all payer contracts',
			},
			{
				name: 'Get Fee Schedule',
				value: 'getFeeSchedule',
				description: 'Retrieve contract fee schedule',
				action: 'Get fee schedule',
			},
			{
				name: 'Get Expected Payment',
				value: 'getExpectedPayment',
				description: 'Calculate expected payment based on contract terms',
				action: 'Get expected payment',
			},
			{
				name: 'Compare to Contract',
				value: 'compareToContract',
				description: 'Compare actual payment to contract terms',
				action: 'Compare payment to contract',
			},
			{
				name: 'Get Contract Variance',
				value: 'getContractVariance',
				description: 'Get variance analysis for contract payments',
				action: 'Get contract variance',
			},
			{
				name: 'Get Underpayment Analysis',
				value: 'getUnderpaymentAnalysis',
				description: 'Analyze underpayments against contract terms',
				action: 'Get underpayment analysis',
			},
			{
				name: 'Get Contract Terms',
				value: 'getContractTerms',
				description: 'Retrieve detailed contract terms and conditions',
				action: 'Get contract terms',
			},
		],
		default: 'getContract',
	},
];

// Contract Resource Fields
export const contractFields: INodeProperties[] = [
	// ----------------------------------
	//         getContract
	// ----------------------------------
	{
		displayName: 'Contract ID',
		name: 'contractId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getContract'],
			},
		},
		default: '',
		description: 'The unique identifier for the contract',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getContract'],
			},
		},
		options: [
			{
				displayName: 'Include Fee Schedule',
				name: 'includeFeeSchedule',
				type: 'boolean',
				default: false,
				description: 'Whether to include the full fee schedule',
			},
			{
				displayName: 'Include Terms',
				name: 'includeTerms',
				type: 'boolean',
				default: true,
				description: 'Whether to include contract terms',
			},
			{
				displayName: 'Include Performance',
				name: 'includePerformance',
				type: 'boolean',
				default: false,
				description: 'Whether to include performance metrics',
			},
		],
	},

	// ----------------------------------
	//         getContracts
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getContracts'],
			},
		},
		options: [
			{
				displayName: 'Payer ID',
				name: 'payerId',
				type: 'string',
				default: '',
				description: 'Filter by specific payer',
			},
			{
				displayName: 'Contract Type',
				name: 'contractType',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Commercial', value: 'commercial' },
					{ name: 'Medicare', value: 'medicare' },
					{ name: 'Medicaid', value: 'medicaid' },
					{ name: 'Workers Comp', value: 'workersComp' },
					{ name: 'Managed Care', value: 'managedCare' },
				],
				default: 'all',
				description: 'Type of contract',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Active', value: 'active' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Expired', value: 'expired' },
					{ name: 'Terminated', value: 'terminated' },
				],
				default: 'active',
				description: 'Contract status',
			},
			{
				displayName: 'Facility ID',
				name: 'facilityId',
				type: 'string',
				default: '',
				description: 'Filter by facility',
			},
			{
				displayName: 'Expiring Within Days',
				name: 'expiringWithinDays',
				type: 'number',
				default: 0,
				description: 'Show contracts expiring within this many days (0 = disabled)',
			},
		],
	},

	// ----------------------------------
	//         getFeeSchedule
	// ----------------------------------
	{
		displayName: 'Contract ID',
		name: 'contractId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getFeeSchedule'],
			},
		},
		default: '',
		description: 'The contract ID to retrieve fee schedule for',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getFeeSchedule'],
			},
		},
		options: [
			{
				displayName: 'Procedure Code',
				name: 'procedureCode',
				type: 'string',
				default: '',
				description: 'Filter by specific CPT/HCPCS code',
			},
			{
				displayName: 'Revenue Code',
				name: 'revenueCode',
				type: 'string',
				default: '',
				description: 'Filter by specific revenue code',
			},
			{
				displayName: 'Service Category',
				name: 'serviceCategory',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Inpatient', value: 'inpatient' },
					{ name: 'Outpatient', value: 'outpatient' },
					{ name: 'Emergency', value: 'emergency' },
					{ name: 'Lab', value: 'lab' },
					{ name: 'Radiology', value: 'radiology' },
					{ name: 'Surgery', value: 'surgery' },
					{ name: 'Professional', value: 'professional' },
				],
				default: 'all',
				description: 'Service category filter',
			},
			{
				displayName: 'Effective Date',
				name: 'effectiveDate',
				type: 'dateTime',
				default: '',
				description: 'Get rates effective on this date',
			},
		],
	},

	// ----------------------------------
	//         getExpectedPayment
	// ----------------------------------
	{
		displayName: 'Contract ID',
		name: 'contractId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getExpectedPayment'],
			},
		},
		default: '',
		description: 'The contract to calculate payment against',
	},
	{
		displayName: 'Procedure Code',
		name: 'procedureCode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getExpectedPayment'],
			},
		},
		default: '',
		description: 'The CPT/HCPCS procedure code',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getExpectedPayment'],
			},
		},
		options: [
			{
				displayName: 'Modifier',
				name: 'modifier',
				type: 'string',
				default: '',
				description: 'Procedure modifier (e.g., 26, TC)',
			},
			{
				displayName: 'Units',
				name: 'units',
				type: 'number',
				default: 1,
				description: 'Number of units',
			},
			{
				displayName: 'Place of Service',
				name: 'placeOfService',
				type: 'string',
				default: '11',
				description: 'Place of service code',
			},
			{
				displayName: 'Revenue Code',
				name: 'revenueCode',
				type: 'string',
				default: '',
				description: 'Revenue code for institutional claims',
			},
			{
				displayName: 'DRG',
				name: 'drg',
				type: 'string',
				default: '',
				description: 'DRG code for inpatient stays',
			},
			{
				displayName: 'Service Date',
				name: 'serviceDate',
				type: 'dateTime',
				default: '',
				description: 'Date of service (for effective rate)',
			},
		],
	},

	// ----------------------------------
	//         compareToContract
	// ----------------------------------
	{
		displayName: 'Claim ID',
		name: 'claimId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['compareToContract'],
			},
		},
		default: '',
		description: 'The claim ID to compare against contract',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['compareToContract'],
			},
		},
		options: [
			{
				displayName: 'Include Line Detail',
				name: 'includeLineDetail',
				type: 'boolean',
				default: true,
				description: 'Whether to include line-by-line comparison',
			},
			{
				displayName: 'Variance Threshold',
				name: 'varianceThreshold',
				type: 'number',
				default: 1,
				description: 'Minimum dollar variance to report',
			},
			{
				displayName: 'Variance Threshold Percent',
				name: 'varianceThresholdPercent',
				type: 'number',
				default: 0,
				description: 'Minimum percentage variance to report',
			},
		],
	},

	// ----------------------------------
	//         getContractVariance
	// ----------------------------------
	{
		displayName: 'Contract ID',
		name: 'contractId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getContractVariance'],
			},
		},
		default: '',
		description: 'Contract ID (leave empty for all contracts)',
	},
	{
		displayName: 'Date Range',
		name: 'dateRange',
		type: 'fixedCollection',
		default: {},
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getContractVariance'],
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
				resource: ['contract'],
				operation: ['getContractVariance'],
			},
		},
		options: [
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'options',
				options: [
					{ name: 'Contract', value: 'contract' },
					{ name: 'Payer', value: 'payer' },
					{ name: 'Procedure', value: 'procedure' },
					{ name: 'Facility', value: 'facility' },
					{ name: 'Provider', value: 'provider' },
				],
				default: 'contract',
				description: 'How to group variance results',
			},
			{
				displayName: 'Minimum Variance',
				name: 'minimumVariance',
				type: 'number',
				default: 100,
				description: 'Minimum total variance to include',
			},
			{
				displayName: 'Variance Type',
				name: 'varianceType',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Underpayments', value: 'underpayments' },
					{ name: 'Overpayments', value: 'overpayments' },
				],
				default: 'all',
				description: 'Type of variance to include',
			},
		],
	},

	// ----------------------------------
	//         getUnderpaymentAnalysis
	// ----------------------------------
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getUnderpaymentAnalysis'],
			},
		},
		options: [
			{
				displayName: 'Payer ID',
				name: 'payerId',
				type: 'string',
				default: '',
				description: 'Filter by specific payer',
			},
			{
				displayName: 'Contract ID',
				name: 'contractId',
				type: 'string',
				default: '',
				description: 'Filter by specific contract',
			},
			{
				displayName: 'Minimum Underpayment',
				name: 'minimumAmount',
				type: 'number',
				default: 50,
				description: 'Minimum underpayment amount to include',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start of analysis period',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End of analysis period',
			},
			{
				displayName: 'Recovery Status',
				name: 'recoveryStatus',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Not Appealed', value: 'notAppealed' },
					{ name: 'Appeal Pending', value: 'appealPending' },
					{ name: 'Recovered', value: 'recovered' },
					{ name: 'Written Off', value: 'writtenOff' },
				],
				default: 'all',
				description: 'Filter by recovery status',
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
				resource: ['contract'],
				operation: ['getUnderpaymentAnalysis'],
			},
		},
		options: [
			{
				displayName: 'Include Claims',
				name: 'includeClaims',
				type: 'boolean',
				default: false,
				description: 'Whether to include individual claim details',
			},
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'options',
				options: [
					{ name: 'Payer', value: 'payer' },
					{ name: 'Contract', value: 'contract' },
					{ name: 'Reason', value: 'reason' },
					{ name: 'Procedure', value: 'procedure' },
				],
				default: 'payer',
				description: 'How to group underpayments',
			},
		],
	},

	// ----------------------------------
	//         getContractTerms
	// ----------------------------------
	{
		displayName: 'Contract ID',
		name: 'contractId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getContractTerms'],
			},
		},
		default: '',
		description: 'The contract ID to retrieve terms for',
	},
	{
		displayName: 'Term Category',
		name: 'termCategory',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['contract'],
				operation: ['getContractTerms'],
			},
		},
		options: [
			{ name: 'All Terms', value: 'all' },
			{ name: 'Payment Terms', value: 'payment' },
			{ name: 'Timely Filing', value: 'timelyFiling' },
			{ name: 'Authorization', value: 'authorization' },
			{ name: 'Carve-Outs', value: 'carveOuts' },
			{ name: 'Escalators', value: 'escalators' },
			{ name: 'Penalties', value: 'penalties' },
		],
		default: 'all',
		description: 'Category of terms to retrieve',
	},
];

// Execute Contract operations
export async function executeContract(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;

	switch (operation) {
		case 'getContract': {
			const contractId = this.getNodeParameter('contractId', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				includeFeeSchedule?: boolean;
				includeTerms?: boolean;
				includePerformance?: boolean;
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
				`${ENDPOINTS.CONTRACT.BASE}/${contractId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getContracts': {
			const filters = this.getNodeParameter('filters', index, {}) as {
				payerId?: string;
				contractType?: string;
				status?: string;
				facilityId?: string;
				expiringWithinDays?: number;
			};

			const queryParams: Record<string, string | number> = {};
			Object.entries(filters).forEach(([key, value]) => {
				if (value && value !== 'all' && value !== 0) {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.CONTRACT.BASE}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getFeeSchedule': {
			const contractId = this.getNodeParameter('contractId', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				procedureCode?: string;
				revenueCode?: string;
				serviceCategory?: string;
				effectiveDate?: string;
			};

			const queryParams: Record<string, string> = {};
			Object.entries(options).forEach(([key, value]) => {
				if (value && value !== 'all') {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.CONTRACT.FEE_SCHEDULE}/${contractId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getExpectedPayment': {
			const contractId = this.getNodeParameter('contractId', index) as string;
			const procedureCode = this.getNodeParameter('procedureCode', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				modifier?: string;
				units?: number;
				placeOfService?: string;
				revenueCode?: string;
				drg?: string;
				serviceDate?: string;
			};

			const body = {
				contractId,
				procedureCode,
				...options,
			};

			responseData = await r1RcmApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.CONTRACT.EXPECTED_PAYMENT}`,
				body,
			);
			break;
		}

		case 'compareToContract': {
			const claimId = this.getNodeParameter('claimId', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				includeLineDetail?: boolean;
				varianceThreshold?: number;
				varianceThresholdPercent?: number;
			};

			const queryParams: Record<string, boolean | number> = {};
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.CONTRACT.COMPARE}/${claimId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getContractVariance': {
			const contractId = this.getNodeParameter('contractId', index, '') as string;
			const dateRange = this.getNodeParameter('dateRange', index, {}) as {
				range?: { startDate?: string; endDate?: string };
			};
			const options = this.getNodeParameter('options', index, {}) as {
				groupBy?: string;
				minimumVariance?: number;
				varianceType?: string;
			};

			const queryParams: Record<string, string | number> = {};
			if (contractId) {
				queryParams.contractId = contractId;
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
				if (value && value !== 'all') {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.CONTRACT.VARIANCE}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getUnderpaymentAnalysis': {
			const filters = this.getNodeParameter('filters', index, {}) as {
				payerId?: string;
				contractId?: string;
				minimumAmount?: number;
				startDate?: string;
				endDate?: string;
				recoveryStatus?: string;
			};
			const options = this.getNodeParameter('options', index, {}) as {
				includeClaims?: boolean;
				groupBy?: string;
			};

			const queryParams: Record<string, string | number | boolean> = {};
			Object.entries(filters).forEach(([key, value]) => {
				if (value && value !== 'all') {
					queryParams[key] = value;
				}
			});
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.CONTRACT.UNDERPAYMENTS}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getContractTerms': {
			const contractId = this.getNodeParameter('contractId', index) as string;
			const termCategory = this.getNodeParameter('termCategory', index, 'all') as string;

			const queryParams: Record<string, string> = {};
			if (termCategory !== 'all') {
				queryParams.category = termCategory;
			}

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.CONTRACT.TERMS}/${contractId}`,
				{},
				queryParams,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for Contract`);
	}

	return this.helpers.returnJsonArray(responseData as object[]);
}
