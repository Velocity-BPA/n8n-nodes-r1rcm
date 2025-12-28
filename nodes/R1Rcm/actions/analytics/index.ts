/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { r1RcmApiRequest } from '../../transport/r1RcmClient';

/**
 * Analytics Resource
 * 
 * Provides comprehensive revenue cycle analytics and KPI dashboards.
 * Includes real-time metrics, trend analysis, and performance benchmarking
 * across all RCM dimensions: collections, A/R, denials, and productivity.
 */

export const analyticsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['analytics'],
			},
		},
		options: [
			{
				name: 'Export Analytics',
				value: 'exportAnalytics',
				description: 'Export analytics data in various formats',
				action: 'Export analytics data',
			},
			{
				name: 'Get A/R Metrics',
				value: 'getArMetrics',
				description: 'Get accounts receivable metrics and aging analysis',
				action: 'Get AR metrics',
			},
			{
				name: 'Get Clean Claim Rate',
				value: 'getCleanClaimRate',
				description: 'Get first-pass claim acceptance rate',
				action: 'Get clean claim rate',
			},
			{
				name: 'Get Collection Rate',
				value: 'getCollectionRate',
				description: 'Get gross and net collection rates',
				action: 'Get collection rate',
			},
			{
				name: 'Get Days in A/R',
				value: 'getDaysInAr',
				description: 'Get average days in accounts receivable',
				action: 'Get days in AR',
			},
			{
				name: 'Get Denial Rate',
				value: 'getDenialRate',
				description: 'Get denial rate by category and payer',
				action: 'Get denial rate',
			},
			{
				name: 'Get Facility Performance',
				value: 'getFacilityPerformance',
				description: 'Get performance metrics by facility',
				action: 'Get facility performance',
			},
			{
				name: 'Get KPI Dashboard',
				value: 'getKpiDashboard',
				description: 'Get comprehensive KPI dashboard with all metrics',
				action: 'Get KPI dashboard',
			},
			{
				name: 'Get Net Collection Rate',
				value: 'getNetCollectionRate',
				description: 'Get net collection rate (collections / adjusted charges)',
				action: 'Get net collection rate',
			},
			{
				name: 'Get Payer Performance',
				value: 'getPayerPerformance',
				description: 'Get performance metrics by payer',
				action: 'Get payer performance',
			},
			{
				name: 'Get Provider Performance',
				value: 'getProviderPerformance',
				description: 'Get performance metrics by provider',
				action: 'Get provider performance',
			},
			{
				name: 'Get Revenue Dashboard',
				value: 'getRevenueDashboard',
				description: 'Get revenue overview dashboard',
				action: 'Get revenue dashboard',
			},
			{
				name: 'Get Revenue Trends',
				value: 'getRevenueTrends',
				description: 'Get revenue trends over time',
				action: 'Get revenue trends',
			},
		],
		default: 'getKpiDashboard',
	},
];

export const analyticsFields: INodeProperties[] = [
	// Date Range - common to most operations
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		default: '',
		description: 'Start date for analytics period',
		displayOptions: {
			show: {
				resource: ['analytics'],
			},
		},
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		default: '',
		description: 'End date for analytics period',
		displayOptions: {
			show: {
				resource: ['analytics'],
			},
		},
	},

	// KPI Dashboard options
	{
		displayName: 'Dashboard Options',
		name: 'dashboardOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getKpiDashboard', 'getRevenueDashboard'],
			},
		},
		options: [
			{
				displayName: 'Compare to Previous Period',
				name: 'compareToPrevious',
				type: 'boolean',
				default: true,
				description: 'Whether to include comparison to previous period',
			},
			{
				displayName: 'Facility ID',
				name: 'facilityId',
				type: 'string',
				default: '',
				description: 'Filter by specific facility',
			},
			{
				displayName: 'Include Benchmarks',
				name: 'includeBenchmarks',
				type: 'boolean',
				default: true,
				description: 'Whether to include industry benchmarks',
			},
			{
				displayName: 'Include Trends',
				name: 'includeTrends',
				type: 'boolean',
				default: true,
				description: 'Whether to include trend data',
			},
		],
	},

	// A/R Metrics options
	{
		displayName: 'A/R Options',
		name: 'arOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getArMetrics', 'getDaysInAr'],
			},
		},
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
					{ name: '121+ Days', value: '121+' },
				],
				default: ['0-30', '31-60', '61-90', '91-120', '121+'],
				description: 'Aging buckets to include',
			},
			{
				displayName: 'Group By',
				name: 'groupBy',
				type: 'options',
				options: [
					{ name: 'Payer', value: 'payer' },
					{ name: 'Facility', value: 'facility' },
					{ name: 'Provider', value: 'provider' },
					{ name: 'Service Type', value: 'serviceType' },
				],
				default: 'payer',
				description: 'How to group A/R metrics',
			},
			{
				displayName: 'Include Self Pay',
				name: 'includeSelfPay',
				type: 'boolean',
				default: true,
				description: 'Whether to include self-pay accounts',
			},
		],
	},

	// Denial Rate options
	{
		displayName: 'Denial Options',
		name: 'denialOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getDenialRate'],
			},
		},
		options: [
			{
				displayName: 'By Category',
				name: 'byCategory',
				type: 'boolean',
				default: true,
				description: 'Whether to break down by denial category',
			},
			{
				displayName: 'By Payer',
				name: 'byPayer',
				type: 'boolean',
				default: true,
				description: 'Whether to break down by payer',
			},
			{
				displayName: 'Include Root Cause',
				name: 'includeRootCause',
				type: 'boolean',
				default: false,
				description: 'Whether to include root cause analysis',
			},
			{
				displayName: 'Include Trends',
				name: 'includeTrends',
				type: 'boolean',
				default: true,
				description: 'Whether to include trend data',
			},
		],
	},

	// Performance options
	{
		displayName: 'Performance Options',
		name: 'performanceOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getPayerPerformance', 'getProviderPerformance', 'getFacilityPerformance'],
			},
		},
		options: [
			{
				displayName: 'Include Details',
				name: 'includeDetails',
				type: 'boolean',
				default: true,
				description: 'Whether to include detailed breakdowns',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 20,
				description: 'Maximum number of results to return',
			},
			{
				displayName: 'Metrics',
				name: 'metrics',
				type: 'multiOptions',
				options: [
					{ name: 'Charges', value: 'charges' },
					{ name: 'Collections', value: 'collections' },
					{ name: 'Denial Rate', value: 'denialRate' },
					{ name: 'Days in A/R', value: 'daysInAr' },
					{ name: 'Clean Claim Rate', value: 'cleanClaimRate' },
					{ name: 'Net Collection Rate', value: 'netCollectionRate' },
				],
				default: ['charges', 'collections', 'denialRate'],
				description: 'Metrics to include',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{ name: 'Charges (High to Low)', value: 'chargesDesc' },
					{ name: 'Collections (High to Low)', value: 'collectionsDesc' },
					{ name: 'Denial Rate (High to Low)', value: 'denialRateDesc' },
					{ name: 'Denial Rate (Low to High)', value: 'denialRateAsc' },
				],
				default: 'chargesDesc',
				description: 'How to sort results',
			},
		],
	},

	// Revenue Trends options
	{
		displayName: 'Trend Options',
		name: 'trendOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['getRevenueTrends'],
			},
		},
		options: [
			{
				displayName: 'Granularity',
				name: 'granularity',
				type: 'options',
				options: [
					{ name: 'Daily', value: 'daily' },
					{ name: 'Weekly', value: 'weekly' },
					{ name: 'Monthly', value: 'monthly' },
					{ name: 'Quarterly', value: 'quarterly' },
				],
				default: 'monthly',
				description: 'Time granularity for trend data',
			},
			{
				displayName: 'Include Forecast',
				name: 'includeForecast',
				type: 'boolean',
				default: false,
				description: 'Whether to include revenue forecast',
			},
			{
				displayName: 'Metrics',
				name: 'metrics',
				type: 'multiOptions',
				options: [
					{ name: 'Gross Charges', value: 'grossCharges' },
					{ name: 'Net Revenue', value: 'netRevenue' },
					{ name: 'Collections', value: 'collections' },
					{ name: 'Adjustments', value: 'adjustments' },
					{ name: 'Write-offs', value: 'writeOffs' },
				],
				default: ['grossCharges', 'netRevenue', 'collections'],
				description: 'Metrics to include in trends',
			},
		],
	},

	// Export options
	{
		displayName: 'Export Options',
		name: 'exportOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['analytics'],
				operation: ['exportAnalytics'],
			},
		},
		options: [
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
				default: 'xlsx',
				description: 'Export format',
			},
			{
				displayName: 'Include Charts',
				name: 'includeCharts',
				type: 'boolean',
				default: true,
				description: 'Whether to include charts (PDF/Excel only)',
			},
			{
				displayName: 'Report Type',
				name: 'reportType',
				type: 'options',
				options: [
					{ name: 'Executive Summary', value: 'executive' },
					{ name: 'A/R Detail', value: 'arDetail' },
					{ name: 'Denial Analysis', value: 'denialAnalysis' },
					{ name: 'Payer Performance', value: 'payerPerformance' },
					{ name: 'Revenue Cycle', value: 'revenueCycle' },
					{ name: 'Custom', value: 'custom' },
				],
				default: 'executive',
				description: 'Type of analytics report to export',
			},
		],
	},
];

/**
 * Execute analytics operations
 */
export async function execute(
	this: IExecuteFunctions,
	index: number,
	operation: string,
): Promise<IDataObject | IDataObject[]> {
	const startDate = this.getNodeParameter('startDate', index, '') as string;
	const endDate = this.getNodeParameter('endDate', index, '') as string;

	let endpoint = '';
	let method: 'GET' | 'POST' = 'GET';
	let body: IDataObject = {};
	let qs: IDataObject = {};

	// Add date range to query
	if (startDate) {
		qs.startDate = startDate;
	}
	if (endDate) {
		qs.endDate = endDate;
	}

	switch (operation) {
		case 'getRevenueDashboard': {
			endpoint = '/analytics/revenue/dashboard';
			const options = this.getNodeParameter('dashboardOptions', index, {}) as IDataObject;
			if (options.facilityId) qs.facilityId = options.facilityId;
			if (options.compareToPrevious !== undefined) qs.compareToPrevious = options.compareToPrevious;
			if (options.includeBenchmarks !== undefined) qs.includeBenchmarks = options.includeBenchmarks;
			if (options.includeTrends !== undefined) qs.includeTrends = options.includeTrends;
			break;
		}

		case 'getKpiDashboard': {
			endpoint = '/analytics/kpi/dashboard';
			const options = this.getNodeParameter('dashboardOptions', index, {}) as IDataObject;
			if (options.facilityId) qs.facilityId = options.facilityId;
			if (options.compareToPrevious !== undefined) qs.compareToPrevious = options.compareToPrevious;
			if (options.includeBenchmarks !== undefined) qs.includeBenchmarks = options.includeBenchmarks;
			if (options.includeTrends !== undefined) qs.includeTrends = options.includeTrends;
			break;
		}

		case 'getArMetrics': {
			endpoint = '/analytics/ar/metrics';
			const options = this.getNodeParameter('arOptions', index, {}) as IDataObject;
			if (options.agingBuckets) qs.agingBuckets = (options.agingBuckets as string[]).join(',');
			if (options.groupBy) qs.groupBy = options.groupBy;
			if (options.includeSelfPay !== undefined) qs.includeSelfPay = options.includeSelfPay;
			break;
		}

		case 'getDaysInAr': {
			endpoint = '/analytics/ar/days';
			const options = this.getNodeParameter('arOptions', index, {}) as IDataObject;
			if (options.groupBy) qs.groupBy = options.groupBy;
			if (options.includeSelfPay !== undefined) qs.includeSelfPay = options.includeSelfPay;
			break;
		}

		case 'getCollectionRate': {
			endpoint = '/analytics/collections/rate';
			break;
		}

		case 'getCleanClaimRate': {
			endpoint = '/analytics/claims/clean-rate';
			break;
		}

		case 'getDenialRate': {
			endpoint = '/analytics/denials/rate';
			const options = this.getNodeParameter('denialOptions', index, {}) as IDataObject;
			if (options.byCategory !== undefined) qs.byCategory = options.byCategory;
			if (options.byPayer !== undefined) qs.byPayer = options.byPayer;
			if (options.includeRootCause !== undefined) qs.includeRootCause = options.includeRootCause;
			if (options.includeTrends !== undefined) qs.includeTrends = options.includeTrends;
			break;
		}

		case 'getNetCollectionRate': {
			endpoint = '/analytics/collections/net-rate';
			break;
		}

		case 'getRevenueTrends': {
			endpoint = '/analytics/revenue/trends';
			const options = this.getNodeParameter('trendOptions', index, {}) as IDataObject;
			if (options.granularity) qs.granularity = options.granularity;
			if (options.metrics) qs.metrics = (options.metrics as string[]).join(',');
			if (options.includeForecast !== undefined) qs.includeForecast = options.includeForecast;
			break;
		}

		case 'getPayerPerformance': {
			endpoint = '/analytics/performance/payer';
			const options = this.getNodeParameter('performanceOptions', index, {}) as IDataObject;
			if (options.metrics) qs.metrics = (options.metrics as string[]).join(',');
			if (options.sortBy) qs.sortBy = options.sortBy;
			if (options.limit) qs.limit = options.limit;
			if (options.includeDetails !== undefined) qs.includeDetails = options.includeDetails;
			break;
		}

		case 'getProviderPerformance': {
			endpoint = '/analytics/performance/provider';
			const options = this.getNodeParameter('performanceOptions', index, {}) as IDataObject;
			if (options.metrics) qs.metrics = (options.metrics as string[]).join(',');
			if (options.sortBy) qs.sortBy = options.sortBy;
			if (options.limit) qs.limit = options.limit;
			if (options.includeDetails !== undefined) qs.includeDetails = options.includeDetails;
			break;
		}

		case 'getFacilityPerformance': {
			endpoint = '/analytics/performance/facility';
			const options = this.getNodeParameter('performanceOptions', index, {}) as IDataObject;
			if (options.metrics) qs.metrics = (options.metrics as string[]).join(',');
			if (options.sortBy) qs.sortBy = options.sortBy;
			if (options.limit) qs.limit = options.limit;
			if (options.includeDetails !== undefined) qs.includeDetails = options.includeDetails;
			break;
		}

		case 'exportAnalytics': {
			endpoint = '/analytics/export';
			method = 'POST';
			const options = this.getNodeParameter('exportOptions', index, {}) as IDataObject;
			body = {
				startDate,
				endDate,
				format: options.format || 'xlsx',
				reportType: options.reportType || 'executive',
				includeCharts: options.includeCharts !== false,
			};
			break;
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}

	const response = await r1RcmApiRequest.call(this, method, endpoint, body, qs);
	return response as IDataObject;
}

export const analytics = {
	operations: analyticsOperations,
	fields: analyticsFields,
	execute,
};
