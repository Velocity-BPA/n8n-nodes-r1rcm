/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { r1RcmApiRequest } from '../../transport/r1RcmClient';

/**
 * Reporting Resource
 * 
 * Provides report generation, scheduling, and export capabilities
 * for all RCM data including A/R, production, denials, and payments.
 */

export const reportingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['reporting'],
			},
		},
		options: [
			{
				name: 'Export Report',
				value: 'exportReport',
				description: 'Export a report in various formats',
				action: 'Export report',
			},
			{
				name: 'Generate Report',
				value: 'generateReport',
				description: 'Generate a new report',
				action: 'Generate report',
			},
			{
				name: 'Get A/R Report',
				value: 'getArReport',
				description: 'Get accounts receivable report',
				action: 'Get AR report',
			},
			{
				name: 'Get Custom Report',
				value: 'getCustomReport',
				description: 'Get a custom-defined report',
				action: 'Get custom report',
			},
			{
				name: 'Get Denial Report',
				value: 'getDenialReport',
				description: 'Get denial analysis report',
				action: 'Get denial report',
			},
			{
				name: 'Get Executive Summary',
				value: 'getExecutiveSummary',
				description: 'Get executive summary report',
				action: 'Get executive summary',
			},
			{
				name: 'Get Payment Report',
				value: 'getPaymentReport',
				description: 'Get payment posting report',
				action: 'Get payment report',
			},
			{
				name: 'Get Production Report',
				value: 'getProductionReport',
				description: 'Get charge/production report',
				action: 'Get production report',
			},
			{
				name: 'Get Report',
				value: 'getReport',
				description: 'Get a specific report by ID',
				action: 'Get report',
			},
			{
				name: 'List Reports',
				value: 'listReports',
				description: 'List available reports',
				action: 'List reports',
			},
			{
				name: 'Schedule Report',
				value: 'scheduleReport',
				description: 'Schedule a recurring report',
				action: 'Schedule report',
			},
		],
		default: 'generateReport',
	},
];

export const reportingFields: INodeProperties[] = [
	// Report ID - for get/export operations
	{
		displayName: 'Report ID',
		name: 'reportId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the report',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['getReport', 'exportReport'],
			},
		},
	},

	// Report Type - for generate
	{
		displayName: 'Report Type',
		name: 'reportType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['generateReport', 'scheduleReport'],
			},
		},
		options: [
			{ name: 'A/R Aging', value: 'arAging' },
			{ name: 'A/R Summary', value: 'arSummary' },
			{ name: 'Charge Detail', value: 'chargeDetail' },
			{ name: 'Claim Status', value: 'claimStatus' },
			{ name: 'Collection Analysis', value: 'collectionAnalysis' },
			{ name: 'Denial Analysis', value: 'denialAnalysis' },
			{ name: 'Executive Summary', value: 'executiveSummary' },
			{ name: 'Financial Summary', value: 'financialSummary' },
			{ name: 'Payer Mix', value: 'payerMix' },
			{ name: 'Payment Posting', value: 'paymentPosting' },
			{ name: 'Production Summary', value: 'productionSummary' },
			{ name: 'Provider Productivity', value: 'providerProductivity' },
			{ name: 'Revenue Cycle', value: 'revenueCycle' },
			{ name: 'Work Queue', value: 'workQueue' },
		],
		default: 'executiveSummary',
		description: 'Type of report to generate',
	},

	// Date Range
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'Report start date',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['generateReport', 'getArReport', 'getProductionReport', 
							'getDenialReport', 'getPaymentReport', 'getExecutiveSummary', 'getCustomReport'],
			},
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		default: '',
		description: 'Report end date',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['generateReport', 'getArReport', 'getProductionReport', 
							'getDenialReport', 'getPaymentReport', 'getExecutiveSummary', 'getCustomReport'],
			},
		},
	},

	// Generate Report options
	{
		displayName: 'Report Options',
		name: 'reportOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['generateReport'],
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
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'JSON', value: 'json' },
					{ name: 'CSV', value: 'csv' },
					{ name: 'Excel', value: 'xlsx' },
					{ name: 'PDF', value: 'pdf' },
				],
				default: 'json',
				description: 'Output format',
			},
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'options',
				options: [
					{ name: 'None', value: 'none' },
					{ name: 'Payer', value: 'payer' },
					{ name: 'Facility', value: 'facility' },
					{ name: 'Provider', value: 'provider' },
					{ name: 'Date', value: 'date' },
				],
				default: 'none',
				description: 'How to group report data',
			},
			{
				displayName: 'Include Details',
				name: 'includeDetails',
				type: 'boolean',
				default: false,
				description: 'Whether to include line-item details',
			},
			{
				displayName: 'Payer ID',
				name: 'payerId',
				type: 'string',
				default: '',
				description: 'Filter by payer',
			},
			{
				displayName: 'Provider ID',
				name: 'providerId',
				type: 'string',
				default: '',
				description: 'Filter by provider',
			},
		],
	},

	// List Reports options
	{
		displayName: 'List Options',
		name: 'listOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['listReports'],
			},
		},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Maximum number of reports to return',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Completed', value: 'completed' },
					{ name: 'Pending', value: 'pending' },
					{ name: 'Failed', value: 'failed' },
				],
				default: 'all',
				description: 'Filter by report status',
			},
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				description: 'Filter by report type',
			},
		],
	},

	// Schedule options
	{
		displayName: 'Schedule Options',
		name: 'scheduleOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['scheduleReport'],
			},
		},
		options: [
			{
				displayName: 'Email Recipients',
				name: 'emailRecipients',
				type: 'string',
				default: '',
				description: 'Comma-separated email addresses for delivery',
			},
			{
				displayName: 'Format',
				name: 'format',
				type: 'options',
				options: [
					{ name: 'Excel', value: 'xlsx' },
					{ name: 'PDF', value: 'pdf' },
					{ name: 'CSV', value: 'csv' },
				],
				default: 'xlsx',
				description: 'Report format for delivery',
			},
			{
				displayName: 'Frequency',
				name: 'frequency',
				type: 'options',
				options: [
					{ name: 'Daily', value: 'daily' },
					{ name: 'Weekly', value: 'weekly' },
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'Quarterly', value: 'quarterly' },
				],
				default: 'weekly',
				description: 'How often to run the report',
			},
			{
				displayName: 'Report Name',
				name: 'reportName',
				type: 'string',
				default: '',
				description: 'Name for the scheduled report',
			},
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'dateTime',
				default: '',
				description: 'When to start the schedule',
			},
		],
	},

	// Export options
	{
		displayName: 'Export Format',
		name: 'exportFormat',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['exportReport'],
			},
		},
		options: [
			{ name: 'CSV', value: 'csv' },
			{ name: 'Excel', value: 'xlsx' },
			{ name: 'PDF', value: 'pdf' },
			{ name: 'JSON', value: 'json' },
		],
		default: 'xlsx',
		description: 'Format for exported report',
	},

	// Custom Report options
	{
		displayName: 'Report Definition ID',
		name: 'reportDefinitionId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the custom report definition',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['getCustomReport'],
			},
		},
	},
	{
		displayName: 'Custom Parameters',
		name: 'customParameters',
		type: 'json',
		default: '{}',
		description: 'Custom parameters for the report (JSON)',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['getCustomReport'],
			},
		},
	},
];

/**
 * Execute reporting operations
 */
export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	let endpoint = '';
	let method: 'GET' | 'POST' = 'GET';
	let body: IDataObject = {};
	let qs: IDataObject = {};

	switch (operation) {
		case 'generateReport': {
			endpoint = '/reports/generate';
			method = 'POST';
			const reportType = this.getNodeParameter('reportType', index) as string;
			const startDate = this.getNodeParameter('startDate', index) as string;
			const endDate = this.getNodeParameter('endDate', index) as string;
			const options = this.getNodeParameter('reportOptions', index, {}) as IDataObject;
			
			body = {
				reportType,
				startDate,
				endDate,
				...options,
			};
			break;
		}

		case 'getReport': {
			const reportId = this.getNodeParameter('reportId', index) as string;
			endpoint = `/reports/${reportId}`;
			break;
		}

		case 'listReports': {
			endpoint = '/reports';
			const options = this.getNodeParameter('listOptions', index, {}) as IDataObject;
			if (options.status && options.status !== 'all') qs.status = options.status;
			if (options.type) qs.type = options.type;
			if (options.limit) qs.limit = options.limit;
			break;
		}

		case 'scheduleReport': {
			endpoint = '/reports/schedule';
			method = 'POST';
			const reportType = this.getNodeParameter('reportType', index) as string;
			const options = this.getNodeParameter('scheduleOptions', index, {}) as IDataObject;
			
			body = {
				reportType,
				...options,
			};
			break;
		}

		case 'getArReport': {
			endpoint = '/reports/ar';
			const startDate = this.getNodeParameter('startDate', index) as string;
			const endDate = this.getNodeParameter('endDate', index) as string;
			qs = { startDate, endDate };
			break;
		}

		case 'getProductionReport': {
			endpoint = '/reports/production';
			const startDate = this.getNodeParameter('startDate', index) as string;
			const endDate = this.getNodeParameter('endDate', index) as string;
			qs = { startDate, endDate };
			break;
		}

		case 'getDenialReport': {
			endpoint = '/reports/denial';
			const startDate = this.getNodeParameter('startDate', index) as string;
			const endDate = this.getNodeParameter('endDate', index) as string;
			qs = { startDate, endDate };
			break;
		}

		case 'getPaymentReport': {
			endpoint = '/reports/payment';
			const startDate = this.getNodeParameter('startDate', index) as string;
			const endDate = this.getNodeParameter('endDate', index) as string;
			qs = { startDate, endDate };
			break;
		}

		case 'getExecutiveSummary': {
			endpoint = '/reports/executive-summary';
			const startDate = this.getNodeParameter('startDate', index) as string;
			const endDate = this.getNodeParameter('endDate', index) as string;
			qs = { startDate, endDate };
			break;
		}

		case 'getCustomReport': {
			const reportDefinitionId = this.getNodeParameter('reportDefinitionId', index) as string;
			endpoint = `/reports/custom/${reportDefinitionId}`;
			method = 'POST';
			const startDate = this.getNodeParameter('startDate', index) as string;
			const endDate = this.getNodeParameter('endDate', index) as string;
			const customParams = this.getNodeParameter('customParameters', index) as string;
			
			body = {
				startDate,
				endDate,
				parameters: JSON.parse(customParams || '{}'),
			};
			break;
		}

		case 'exportReport': {
			const reportId = this.getNodeParameter('reportId', index) as string;
			const format = this.getNodeParameter('exportFormat', index) as string;
			endpoint = `/reports/${reportId}/export`;
			qs = { format };
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	const response = await r1RcmApiRequest.call(this, method, endpoint, body, qs);
	return response as IDataObject;
}

export const reporting = {
	operations: reportingOperations,
	fields: reportingFields,
	execute,
};
