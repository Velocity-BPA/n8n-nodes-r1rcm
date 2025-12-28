/* Copyright (c) Velocity BPA, LLC. Licensed under the Business Source License 1.1. See LICENSE file for details. Commercial use requires a separate license from Velocity BPA. */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';

/**
 * Webhook Resource Operations
 * 
 * Webhooks enable real-time notifications for RCM events:
 * - Patient registration changes
 * - Eligibility verification results
 * - Prior authorization status updates
 * - Claim status changes
 * - Denial notifications
 * - Payment postings
 * - Work queue assignments
 * 
 * Webhooks are essential for building responsive healthcare workflows
 * that react immediately to revenue cycle events.
 */

// Event types for webhook subscriptions
const WEBHOOK_EVENT_TYPES = [
	// Patient Events
	{ name: 'Patient Registered', value: 'patient.registered', description: 'New patient registration' },
	{ name: 'Patient Updated', value: 'patient.updated', description: 'Patient demographics updated' },
	{ name: 'Patient Merged', value: 'patient.merged', description: 'Patient records merged' },
	{ name: 'Coverage Verified', value: 'patient.coverage_verified', description: 'Insurance coverage verified' },
	{ name: 'Financial Clearance', value: 'patient.financial_clearance', description: 'Financial clearance completed' },

	// Registration Events
	{ name: 'Registration Created', value: 'registration.created', description: 'New registration created' },
	{ name: 'Registration Completed', value: 'registration.completed', description: 'Registration workflow completed' },
	{ name: 'Pre-Registration Done', value: 'registration.pre_registration_done', description: 'Pre-registration completed' },

	// Eligibility Events
	{ name: 'Eligibility Verified', value: 'eligibility.verified', description: 'Eligibility successfully verified' },
	{ name: 'Eligibility Failed', value: 'eligibility.failed', description: 'Eligibility verification failed' },
	{ name: 'Benefits Updated', value: 'eligibility.benefits_updated', description: 'Patient benefits information updated' },

	// Authorization Events
	{ name: 'Auth Submitted', value: 'authorization.submitted', description: 'Prior authorization submitted' },
	{ name: 'Auth Approved', value: 'authorization.approved', description: 'Prior authorization approved' },
	{ name: 'Auth Denied', value: 'authorization.denied', description: 'Prior authorization denied' },
	{ name: 'Auth Pending', value: 'authorization.pending', description: 'Prior authorization pending review' },
	{ name: 'Auth Expiring', value: 'authorization.expiring', description: 'Prior authorization expiring soon' },
	{ name: 'Auth Expired', value: 'authorization.expired', description: 'Prior authorization has expired' },

	// Charge Events
	{ name: 'Charge Created', value: 'charge.created', description: 'New charge captured' },
	{ name: 'Charge Updated', value: 'charge.updated', description: 'Charge information updated' },
	{ name: 'Charge Review Required', value: 'charge.review_required', description: 'Charge requires manual review' },
	{ name: 'Charge Lag Alert', value: 'charge.lag_alert', description: 'Charge lag threshold exceeded' },

	// Coding Events
	{ name: 'Coding Complete', value: 'coding.complete', description: 'Coding for encounter completed' },
	{ name: 'Coding Review Required', value: 'coding.review_required', description: 'Coding requires review' },
	{ name: 'Code Validation Error', value: 'coding.validation_error', description: 'Code validation error detected' },
	{ name: 'DRG Assigned', value: 'coding.drg_assigned', description: 'DRG code assigned to encounter' },

	// Claim Events
	{ name: 'Claim Created', value: 'claim.created', description: 'New claim created' },
	{ name: 'Claim Submitted', value: 'claim.submitted', description: 'Claim submitted to payer' },
	{ name: 'Claim Accepted', value: 'claim.accepted', description: 'Claim accepted by payer' },
	{ name: 'Claim Rejected', value: 'claim.rejected', description: 'Claim rejected by payer' },
	{ name: 'Claim Paid', value: 'claim.paid', description: 'Claim has been paid' },
	{ name: 'Claim Denied', value: 'claim.denied', description: 'Claim denied by payer' },
	{ name: 'Claim Status Changed', value: 'claim.status_changed', description: 'Claim status has changed' },

	// Denial Events
	{ name: 'Denial Received', value: 'denial.received', description: 'New denial received' },
	{ name: 'Appeal Due', value: 'denial.appeal_due', description: 'Appeal deadline approaching' },
	{ name: 'Appeal Submitted', value: 'denial.appeal_submitted', description: 'Appeal has been submitted' },
	{ name: 'Appeal Decision', value: 'denial.appeal_decision', description: 'Appeal decision received' },
	{ name: 'Denial Overturned', value: 'denial.overturned', description: 'Denial has been overturned' },

	// Payment Events
	{ name: 'Payment Received', value: 'payment.received', description: 'Payment received' },
	{ name: 'Payment Posted', value: 'payment.posted', description: 'Payment posted to account' },
	{ name: 'Underpayment Detected', value: 'payment.underpayment', description: 'Underpayment detected' },
	{ name: 'Payment Variance', value: 'payment.variance', description: 'Payment variance detected' },
	{ name: 'ERA Received', value: 'payment.era_received', description: 'ERA (835) file received' },

	// Work Queue Events
	{ name: 'Work Assigned', value: 'workqueue.assigned', description: 'Work item assigned' },
	{ name: 'Work Due', value: 'workqueue.due', description: 'Work item due date approaching' },
	{ name: 'SLA Warning', value: 'workqueue.sla_warning', description: 'SLA threshold warning' },
	{ name: 'SLA Breach', value: 'workqueue.sla_breach', description: 'SLA has been breached' },
	{ name: 'Queue Threshold', value: 'workqueue.threshold', description: 'Queue threshold exceeded' },

	// Analytics Events
	{ name: 'KPI Alert', value: 'analytics.kpi_alert', description: 'KPI threshold breached' },
	{ name: 'Threshold Exceeded', value: 'analytics.threshold_exceeded', description: 'Analytics threshold exceeded' },
	{ name: 'Trend Alert', value: 'analytics.trend_alert', description: 'Significant trend detected' },
	{ name: 'Report Ready', value: 'analytics.report_ready', description: 'Scheduled report is ready' },

	// Epic Integration Events
	{ name: 'Epic Sync Complete', value: 'epic.sync_complete', description: 'Epic data synchronization complete' },
	{ name: 'Epic Sync Error', value: 'epic.sync_error', description: 'Epic synchronization error' },
	{ name: 'Epic Message Received', value: 'epic.message_received', description: 'HL7 message received from Epic' },
];

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Create Webhook',
				value: 'createWebhook',
				description: 'Create a new webhook subscription',
				action: 'Create webhook',
			},
			{
				name: 'Get Webhook',
				value: 'getWebhook',
				description: 'Get webhook details',
				action: 'Get webhook',
			},
			{
				name: 'Update Webhook',
				value: 'updateWebhook',
				description: 'Update an existing webhook',
				action: 'Update webhook',
			},
			{
				name: 'Delete Webhook',
				value: 'deleteWebhook',
				description: 'Delete a webhook subscription',
				action: 'Delete webhook',
			},
			{
				name: 'List Webhooks',
				value: 'listWebhooks',
				description: 'List all webhook subscriptions',
				action: 'List webhooks',
			},
			{
				name: 'Test Webhook',
				value: 'testWebhook',
				description: 'Send a test event to a webhook',
				action: 'Test webhook',
			},
			{
				name: 'Get Webhook Events',
				value: 'getWebhookEvents',
				description: 'Get event delivery history for a webhook',
				action: 'Get webhook events',
			},
		],
		default: 'listWebhooks',
	},
];

export const webhookFields: INodeProperties[] = [
	// Create Webhook fields
	{
		displayName: 'Webhook Name',
		name: 'webhookName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createWebhook'],
			},
		},
		default: '',
		placeholder: 'Claim Status Notifications',
		description: 'Name to identify this webhook subscription',
	},
	{
		displayName: 'Target URL',
		name: 'targetUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createWebhook'],
			},
		},
		default: '',
		placeholder: 'https://your-server.com/webhook/r1rcm',
		description: 'URL where webhook events will be sent',
	},
	{
		displayName: 'Events',
		name: 'events',
		type: 'multiOptions',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createWebhook'],
			},
		},
		options: WEBHOOK_EVENT_TYPES,
		default: [],
		description: 'Events that will trigger this webhook',
	},
	{
		displayName: 'Create Options',
		name: 'createOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['createWebhook'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of this webhook subscription',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Secret key for webhook signature verification',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is enabled immediately',
			},
			{
				displayName: 'Facility Filter',
				name: 'facilityFilter',
				type: 'string',
				default: '',
				placeholder: 'FAC001,FAC002',
				description: 'Comma-separated list of facility IDs to filter events (empty = all)',
			},
			{
				displayName: 'Provider Filter',
				name: 'providerFilter',
				type: 'string',
				default: '',
				placeholder: 'NPI1234567890',
				description: 'Filter events to specific providers',
			},
			{
				displayName: 'Payer Filter',
				name: 'payerFilter',
				type: 'string',
				default: '',
				placeholder: 'PAYER001,PAYER002',
				description: 'Comma-separated list of payer IDs to filter events',
			},
			{
				displayName: 'Minimum Amount',
				name: 'minimumAmount',
				type: 'number',
				default: 0,
				description: 'Only trigger for financial events above this amount',
			},
			{
				displayName: 'Include PHI',
				name: 'includePhi',
				type: 'boolean',
				default: false,
				description: 'Whether to include Protected Health Information in webhook payload (requires BAA)',
			},
			{
				displayName: 'Retry Policy',
				name: 'retryPolicy',
				type: 'options',
				options: [
					{ name: 'Standard (3 retries)', value: 'standard' },
					{ name: 'Extended (5 retries)', value: 'extended' },
					{ name: 'No Retry', value: 'none' },
				],
				default: 'standard',
				description: 'Retry policy for failed deliveries',
			},
			{
				displayName: 'Content Type',
				name: 'contentType',
				type: 'options',
				options: [
					{ name: 'JSON', value: 'application/json' },
					{ name: 'Form URL Encoded', value: 'application/x-www-form-urlencoded' },
				],
				default: 'application/json',
				description: 'Content type for webhook payloads',
			},
			{
				displayName: 'Custom Headers',
				name: 'customHeaders',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'header',
						displayName: 'Header',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
				description: 'Custom headers to include in webhook requests',
			},
		],
	},

	// Get Webhook fields
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['getWebhook', 'updateWebhook', 'deleteWebhook', 'testWebhook', 'getWebhookEvents'],
			},
		},
		default: '',
		description: 'ID of the webhook',
	},

	// Update Webhook fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['updateWebhook'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the webhook',
			},
			{
				displayName: 'Target URL',
				name: 'targetUrl',
				type: 'string',
				default: '',
				description: 'New target URL for webhook events',
			},
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: WEBHOOK_EVENT_TYPES,
				default: [],
				description: 'New event subscriptions',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is enabled',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'New secret for webhook signature verification',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the webhook',
			},
			{
				displayName: 'Facility Filter',
				name: 'facilityFilter',
				type: 'string',
				default: '',
				description: 'New facility filter (comma-separated IDs)',
			},
			{
				displayName: 'Provider Filter',
				name: 'providerFilter',
				type: 'string',
				default: '',
				description: 'New provider filter',
			},
			{
				displayName: 'Payer Filter',
				name: 'payerFilter',
				type: 'string',
				default: '',
				description: 'New payer filter (comma-separated IDs)',
			},
			{
				displayName: 'Minimum Amount',
				name: 'minimumAmount',
				type: 'number',
				default: 0,
				description: 'New minimum amount threshold',
			},
		],
	},

	// List Webhooks fields
	{
		displayName: 'List Options',
		name: 'listOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['listWebhooks'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					...WEBHOOK_EVENT_TYPES,
				],
				default: 'all',
				description: 'Filter by subscribed event type',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Enabled', value: 'enabled' },
					{ name: 'Disabled', value: 'disabled' },
				],
				default: 'all',
				description: 'Filter by webhook status',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Maximum number of webhooks to return',
			},
			{
				displayName: 'Include Stats',
				name: 'includeStats',
				type: 'boolean',
				default: true,
				description: 'Whether to include delivery statistics',
			},
		],
	},

	// Test Webhook fields
	{
		displayName: 'Test Event Type',
		name: 'testEventType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['testWebhook'],
			},
		},
		options: WEBHOOK_EVENT_TYPES,
		default: 'claim.status_changed',
		description: 'Type of test event to send',
	},
	{
		displayName: 'Test Options',
		name: 'testOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['testWebhook'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Custom Payload',
				name: 'customPayload',
				type: 'json',
				default: '{}',
				description: 'Custom payload to include in test event',
			},
			{
				displayName: 'Wait For Response',
				name: 'waitForResponse',
				type: 'boolean',
				default: true,
				description: 'Whether to wait for and return the response from the webhook endpoint',
			},
			{
				displayName: 'Timeout (seconds)',
				name: 'timeout',
				type: 'number',
				default: 30,
				description: 'Timeout for waiting for response',
			},
		],
	},

	// Get Webhook Events fields
	{
		displayName: 'Event History Options',
		name: 'eventHistoryOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['getWebhookEvents'],
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
					{ name: 'Delivered', value: 'delivered' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Pending', value: 'pending' },
				],
				default: 'all',
				description: 'Filter by delivery status',
			},
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					...WEBHOOK_EVENT_TYPES,
				],
				default: 'all',
				description: 'Filter by event type',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for event history',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for event history',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Maximum number of events to return',
			},
			{
				displayName: 'Include Response',
				name: 'includeResponse',
				type: 'boolean',
				default: false,
				description: 'Whether to include response details for each event',
			},
		],
	},
];

/**
 * Execute webhook operations
 */
export async function executeWebhookOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('r1RcmApi');
	const { R1RcmClient } = await import('../../transport/r1RcmClient');
	const client = new R1RcmClient(credentials);

	switch (operation) {
		case 'createWebhook': {
			const webhookName = this.getNodeParameter('webhookName', index) as string;
			const targetUrl = this.getNodeParameter('targetUrl', index) as string;
			const events = this.getNodeParameter('events', index) as string[];
			const createOptions = this.getNodeParameter('createOptions', index, {}) as IDataObject;

			// Validate target URL
			try {
				new URL(targetUrl);
			} catch {
				throw new Error('Invalid target URL format');
			}

			// Build request payload
			const payload: IDataObject = {
				name: webhookName,
				url: targetUrl,
				events,
				enabled: createOptions.enabled !== false,
			};

			if (createOptions.description) payload.description = createOptions.description;
			if (createOptions.secret) payload.secret = createOptions.secret;
			if (createOptions.retryPolicy) payload.retryPolicy = createOptions.retryPolicy;
			if (createOptions.contentType) payload.contentType = createOptions.contentType;
			if (createOptions.includePhi !== undefined) payload.includePhi = createOptions.includePhi;

			// Add filters
			const filters: IDataObject = {};
			if (createOptions.facilityFilter) {
				filters.facilities = (createOptions.facilityFilter as string).split(',').map(s => s.trim());
			}
			if (createOptions.providerFilter) {
				filters.providers = (createOptions.providerFilter as string).split(',').map(s => s.trim());
			}
			if (createOptions.payerFilter) {
				filters.payers = (createOptions.payerFilter as string).split(',').map(s => s.trim());
			}
			if (createOptions.minimumAmount) {
				filters.minimumAmount = createOptions.minimumAmount;
			}
			if (Object.keys(filters).length > 0) {
				payload.filters = filters;
			}

			// Add custom headers
			if (createOptions.customHeaders) {
				const headersConfig = createOptions.customHeaders as IDataObject;
				const headers: Record<string, string> = {};
				if (headersConfig.header && Array.isArray(headersConfig.header)) {
					for (const h of headersConfig.header as IDataObject[]) {
						if (h.name && h.value) {
							headers[h.name as string] = h.value as string;
						}
					}
				}
				if (Object.keys(headers).length > 0) {
					payload.headers = headers;
				}
			}

			const response = await client.request('POST', '/webhooks', payload);

			return {
				success: true,
				operation: 'createWebhook',
				webhook: response,
				createdAt: new Date().toISOString(),
			};
		}

		case 'getWebhook': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			
			const response = await client.request('GET', `/webhooks/${webhookId}`);

			return {
				success: true,
				operation: 'getWebhook',
				webhook: response,
			};
		}

		case 'updateWebhook': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			if (Object.keys(updateFields).length === 0) {
				throw new Error('At least one field must be provided for update');
			}

			const payload: IDataObject = {};

			if (updateFields.name) payload.name = updateFields.name;
			if (updateFields.targetUrl) payload.url = updateFields.targetUrl;
			if (updateFields.events) payload.events = updateFields.events;
			if (updateFields.enabled !== undefined) payload.enabled = updateFields.enabled;
			if (updateFields.secret) payload.secret = updateFields.secret;
			if (updateFields.description) payload.description = updateFields.description;

			// Update filters
			const filters: IDataObject = {};
			if (updateFields.facilityFilter) {
				filters.facilities = (updateFields.facilityFilter as string).split(',').map(s => s.trim());
			}
			if (updateFields.providerFilter) {
				filters.providers = (updateFields.providerFilter as string).split(',').map(s => s.trim());
			}
			if (updateFields.payerFilter) {
				filters.payers = (updateFields.payerFilter as string).split(',').map(s => s.trim());
			}
			if (updateFields.minimumAmount) {
				filters.minimumAmount = updateFields.minimumAmount;
			}
			if (Object.keys(filters).length > 0) {
				payload.filters = filters;
			}

			const response = await client.request('PATCH', `/webhooks/${webhookId}`, payload);

			return {
				success: true,
				operation: 'updateWebhook',
				webhookId,
				webhook: response,
				updatedAt: new Date().toISOString(),
			};
		}

		case 'deleteWebhook': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;

			await client.request('DELETE', `/webhooks/${webhookId}`);

			return {
				success: true,
				operation: 'deleteWebhook',
				webhookId,
				deletedAt: new Date().toISOString(),
			};
		}

		case 'listWebhooks': {
			const listOptions = this.getNodeParameter('listOptions', index, {}) as IDataObject;

			const params: IDataObject = {
				limit: listOptions.limit || 50,
			};

			if (listOptions.eventType && listOptions.eventType !== 'all') {
				params.eventType = listOptions.eventType;
			}
			if (listOptions.status && listOptions.status !== 'all') {
				params.enabled = listOptions.status === 'enabled';
			}
			if (listOptions.includeStats !== false) {
				params.includeStats = true;
			}

			const response = await client.request('GET', '/webhooks', undefined, params);

			return {
				success: true,
				operation: 'listWebhooks',
				totalWebhooks: response.total || (response.webhooks ? response.webhooks.length : 0),
				webhooks: response.webhooks || response,
			};
		}

		case 'testWebhook': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const testEventType = this.getNodeParameter('testEventType', index) as string;
			const testOptions = this.getNodeParameter('testOptions', index, {}) as IDataObject;

			const payload: IDataObject = {
				eventType: testEventType,
			};

			if (testOptions.customPayload) {
				try {
					payload.customData = JSON.parse(testOptions.customPayload as string);
				} catch {
					throw new Error('Invalid JSON in custom payload');
				}
			}

			const params: IDataObject = {
				waitForResponse: testOptions.waitForResponse !== false,
				timeout: testOptions.timeout || 30,
			};

			const response = await client.request('POST', `/webhooks/${webhookId}/test`, payload, params);

			return {
				success: true,
				operation: 'testWebhook',
				webhookId,
				testEvent: {
					type: testEventType,
					sentAt: new Date().toISOString(),
				},
				result: response,
			};
		}

		case 'getWebhookEvents': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const eventHistoryOptions = this.getNodeParameter('eventHistoryOptions', index, {}) as IDataObject;

			const params: IDataObject = {
				limit: eventHistoryOptions.limit || 100,
			};

			if (eventHistoryOptions.status && eventHistoryOptions.status !== 'all') {
				params.status = eventHistoryOptions.status;
			}
			if (eventHistoryOptions.eventType && eventHistoryOptions.eventType !== 'all') {
				params.eventType = eventHistoryOptions.eventType;
			}
			if (eventHistoryOptions.startDate) {
				params.startDate = eventHistoryOptions.startDate;
			}
			if (eventHistoryOptions.endDate) {
				params.endDate = eventHistoryOptions.endDate;
			}
			if (eventHistoryOptions.includeResponse) {
				params.includeResponse = true;
			}

			const response = await client.request('GET', `/webhooks/${webhookId}/events`, undefined, params);

			// Calculate delivery statistics
			const events = response.events || response;
			const stats = {
				total: events.length,
				delivered: events.filter((e: IDataObject) => e.status === 'delivered').length,
				failed: events.filter((e: IDataObject) => e.status === 'failed').length,
				pending: events.filter((e: IDataObject) => e.status === 'pending').length,
			};

			return {
				success: true,
				operation: 'getWebhookEvents',
				webhookId,
				statistics: stats,
				events,
			};
		}

		default:
			throw new Error(`Unknown webhook operation: ${operation}`);
	}
}
