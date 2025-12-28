/* Copyright (c) Velocity BPA, LLC. Licensed under the Business Source License 1.1. See LICENSE file for details. Commercial use requires a separate license from Velocity BPA. */

import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

/**
 * R1 RCM Trigger Node
 * 
 * Provides real-time event notifications for healthcare revenue cycle events:
 * - Patient registration and updates
 * - Eligibility verification results
 * - Prior authorization status changes
 * - Claim lifecycle events
 * - Denial notifications
 * - Payment postings
 * - Work queue assignments
 * - Analytics alerts
 * 
 * Events are received via webhooks registered with the R1 RCM platform.
 */
export class R1RcmTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'R1 RCM Trigger',
		name: 'r1RcmTrigger',
		icon: 'file:r1rcm.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Trigger workflows on R1 RCM revenue cycle events',
		defaults: {
			name: 'R1 RCM Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'r1RcmApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			// License notice
			{
				displayName: 'This node is licensed under BSL 1.1. Commercial use by for-profit organizations requires a license from Velocity BPA. Visit velobpa.com/licensing for details.',
				name: 'licenseNotice',
				type: 'notice',
				default: '',
			},
			// Event category selector
			{
				displayName: 'Event Category',
				name: 'eventCategory',
				type: 'options',
				options: [
					{
						name: 'Patient',
						value: 'patient',
						description: 'Patient registration and updates',
					},
					{
						name: 'Registration',
						value: 'registration',
						description: 'Registration workflow events',
					},
					{
						name: 'Eligibility',
						value: 'eligibility',
						description: 'Eligibility verification events',
					},
					{
						name: 'Authorization',
						value: 'authorization',
						description: 'Prior authorization events',
					},
					{
						name: 'Charge',
						value: 'charge',
						description: 'Charge capture events',
					},
					{
						name: 'Coding',
						value: 'coding',
						description: 'Medical coding events',
					},
					{
						name: 'Claim',
						value: 'claim',
						description: 'Claim lifecycle events',
					},
					{
						name: 'Denial',
						value: 'denial',
						description: 'Denial and appeal events',
					},
					{
						name: 'Payment',
						value: 'payment',
						description: 'Payment posting events',
					},
					{
						name: 'Work Queue',
						value: 'workQueue',
						description: 'Work queue events',
					},
					{
						name: 'Analytics',
						value: 'analytics',
						description: 'Analytics and alert events',
					},
					{
						name: 'Epic Integration',
						value: 'epic',
						description: 'Epic EHR integration events',
					},
				],
				default: 'claim',
				description: 'Category of events to trigger on',
			},
			// Patient events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['patient'],
					},
				},
				options: [
					{
						name: 'Patient Registered',
						value: 'patient.registered',
						description: 'New patient registration',
					},
					{
						name: 'Patient Updated',
						value: 'patient.updated',
						description: 'Patient demographics updated',
					},
					{
						name: 'Patient Merged',
						value: 'patient.merged',
						description: 'Patient records merged',
					},
					{
						name: 'Coverage Verified',
						value: 'patient.coverage_verified',
						description: 'Insurance coverage verified',
					},
					{
						name: 'Financial Clearance',
						value: 'patient.financial_clearance',
						description: 'Financial clearance completed',
					},
				],
				default: 'patient.registered',
				description: 'Specific patient event to trigger on',
			},
			// Registration events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['registration'],
					},
				},
				options: [
					{
						name: 'Registration Created',
						value: 'registration.created',
						description: 'New registration created',
					},
					{
						name: 'Registration Completed',
						value: 'registration.completed',
						description: 'Registration workflow completed',
					},
					{
						name: 'Pre-Registration Done',
						value: 'registration.pre_registration_done',
						description: 'Pre-registration completed',
					},
				],
				default: 'registration.created',
				description: 'Specific registration event to trigger on',
			},
			// Eligibility events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['eligibility'],
					},
				},
				options: [
					{
						name: 'Eligibility Verified',
						value: 'eligibility.verified',
						description: 'Eligibility successfully verified',
					},
					{
						name: 'Eligibility Failed',
						value: 'eligibility.failed',
						description: 'Eligibility verification failed',
					},
					{
						name: 'Benefits Updated',
						value: 'eligibility.benefits_updated',
						description: 'Patient benefits information updated',
					},
				],
				default: 'eligibility.verified',
				description: 'Specific eligibility event to trigger on',
			},
			// Authorization events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['authorization'],
					},
				},
				options: [
					{
						name: 'Auth Submitted',
						value: 'authorization.submitted',
						description: 'Prior authorization submitted',
					},
					{
						name: 'Auth Approved',
						value: 'authorization.approved',
						description: 'Prior authorization approved',
					},
					{
						name: 'Auth Denied',
						value: 'authorization.denied',
						description: 'Prior authorization denied',
					},
					{
						name: 'Auth Pending',
						value: 'authorization.pending',
						description: 'Prior authorization pending review',
					},
					{
						name: 'Auth Expiring',
						value: 'authorization.expiring',
						description: 'Prior authorization expiring soon',
					},
					{
						name: 'Auth Expired',
						value: 'authorization.expired',
						description: 'Prior authorization has expired',
					},
				],
				default: 'authorization.approved',
				description: 'Specific authorization event to trigger on',
			},
			// Charge events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['charge'],
					},
				},
				options: [
					{
						name: 'Charge Created',
						value: 'charge.created',
						description: 'New charge captured',
					},
					{
						name: 'Charge Updated',
						value: 'charge.updated',
						description: 'Charge information updated',
					},
					{
						name: 'Charge Review Required',
						value: 'charge.review_required',
						description: 'Charge requires manual review',
					},
					{
						name: 'Charge Lag Alert',
						value: 'charge.lag_alert',
						description: 'Charge lag threshold exceeded',
					},
				],
				default: 'charge.created',
				description: 'Specific charge event to trigger on',
			},
			// Coding events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['coding'],
					},
				},
				options: [
					{
						name: 'Coding Complete',
						value: 'coding.complete',
						description: 'Coding for encounter completed',
					},
					{
						name: 'Coding Review Required',
						value: 'coding.review_required',
						description: 'Coding requires review',
					},
					{
						name: 'Code Validation Error',
						value: 'coding.validation_error',
						description: 'Code validation error detected',
					},
					{
						name: 'DRG Assigned',
						value: 'coding.drg_assigned',
						description: 'DRG code assigned to encounter',
					},
				],
				default: 'coding.complete',
				description: 'Specific coding event to trigger on',
			},
			// Claim events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['claim'],
					},
				},
				options: [
					{
						name: 'Claim Created',
						value: 'claim.created',
						description: 'New claim created',
					},
					{
						name: 'Claim Submitted',
						value: 'claim.submitted',
						description: 'Claim submitted to payer',
					},
					{
						name: 'Claim Accepted',
						value: 'claim.accepted',
						description: 'Claim accepted by payer',
					},
					{
						name: 'Claim Rejected',
						value: 'claim.rejected',
						description: 'Claim rejected by payer',
					},
					{
						name: 'Claim Paid',
						value: 'claim.paid',
						description: 'Claim has been paid',
					},
					{
						name: 'Claim Denied',
						value: 'claim.denied',
						description: 'Claim denied by payer',
					},
					{
						name: 'Claim Status Changed',
						value: 'claim.status_changed',
						description: 'Claim status has changed',
					},
				],
				default: 'claim.submitted',
				description: 'Specific claim event to trigger on',
			},
			// Denial events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['denial'],
					},
				},
				options: [
					{
						name: 'Denial Received',
						value: 'denial.received',
						description: 'New denial received',
					},
					{
						name: 'Appeal Due',
						value: 'denial.appeal_due',
						description: 'Appeal deadline approaching',
					},
					{
						name: 'Appeal Submitted',
						value: 'denial.appeal_submitted',
						description: 'Appeal has been submitted',
					},
					{
						name: 'Appeal Decision',
						value: 'denial.appeal_decision',
						description: 'Appeal decision received',
					},
					{
						name: 'Denial Overturned',
						value: 'denial.overturned',
						description: 'Denial has been overturned',
					},
				],
				default: 'denial.received',
				description: 'Specific denial event to trigger on',
			},
			// Payment events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['payment'],
					},
				},
				options: [
					{
						name: 'Payment Received',
						value: 'payment.received',
						description: 'Payment received',
					},
					{
						name: 'Payment Posted',
						value: 'payment.posted',
						description: 'Payment posted to account',
					},
					{
						name: 'Underpayment Detected',
						value: 'payment.underpayment',
						description: 'Underpayment detected',
					},
					{
						name: 'Payment Variance',
						value: 'payment.variance',
						description: 'Payment variance detected',
					},
					{
						name: 'ERA Received',
						value: 'payment.era_received',
						description: 'ERA (835) file received',
					},
				],
				default: 'payment.received',
				description: 'Specific payment event to trigger on',
			},
			// Work Queue events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['workQueue'],
					},
				},
				options: [
					{
						name: 'Work Assigned',
						value: 'workqueue.assigned',
						description: 'Work item assigned',
					},
					{
						name: 'Work Due',
						value: 'workqueue.due',
						description: 'Work item due date approaching',
					},
					{
						name: 'SLA Warning',
						value: 'workqueue.sla_warning',
						description: 'SLA threshold warning',
					},
					{
						name: 'SLA Breach',
						value: 'workqueue.sla_breach',
						description: 'SLA has been breached',
					},
					{
						name: 'Queue Threshold',
						value: 'workqueue.threshold',
						description: 'Queue threshold exceeded',
					},
				],
				default: 'workqueue.assigned',
				description: 'Specific work queue event to trigger on',
			},
			// Analytics events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['analytics'],
					},
				},
				options: [
					{
						name: 'KPI Alert',
						value: 'analytics.kpi_alert',
						description: 'KPI threshold breached',
					},
					{
						name: 'Threshold Exceeded',
						value: 'analytics.threshold_exceeded',
						description: 'Analytics threshold exceeded',
					},
					{
						name: 'Trend Alert',
						value: 'analytics.trend_alert',
						description: 'Significant trend detected',
					},
					{
						name: 'Report Ready',
						value: 'analytics.report_ready',
						description: 'Scheduled report is ready',
					},
				],
				default: 'analytics.kpi_alert',
				description: 'Specific analytics event to trigger on',
			},
			// Epic Integration events
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				displayOptions: {
					show: {
						eventCategory: ['epic'],
					},
				},
				options: [
					{
						name: 'Epic Sync Complete',
						value: 'epic.sync_complete',
						description: 'Epic data synchronization complete',
					},
					{
						name: 'Epic Sync Error',
						value: 'epic.sync_error',
						description: 'Epic synchronization error',
					},
					{
						name: 'Epic Message Received',
						value: 'epic.message_received',
						description: 'HL7 message received from Epic',
					},
				],
				default: 'epic.sync_complete',
				description: 'Specific Epic event to trigger on',
			},
			// Filter options
			{
				displayName: 'Filter Options',
				name: 'filterOptions',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Facility IDs',
						name: 'facilityIds',
						type: 'string',
						default: '',
						placeholder: 'FAC001, FAC002',
						description: 'Filter events by facility ID (comma-separated)',
					},
					{
						displayName: 'Provider IDs',
						name: 'providerIds',
						type: 'string',
						default: '',
						placeholder: 'PRV001, PRV002',
						description: 'Filter events by provider ID (comma-separated)',
					},
					{
						displayName: 'Payer IDs',
						name: 'payerIds',
						type: 'string',
						default: '',
						placeholder: 'PAY001, PAY002',
						description: 'Filter events by payer ID (comma-separated)',
					},
					{
						displayName: 'Minimum Amount',
						name: 'minimumAmount',
						type: 'number',
						default: 0,
						description: 'Minimum claim/payment amount to trigger (for financial events)',
					},
				],
			},
			// Webhook options
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Raw Payload',
						name: 'includeRawPayload',
						type: 'boolean',
						default: false,
						description: 'Whether to include the raw webhook payload in output',
					},
					{
						displayName: 'Webhook Secret',
						name: 'webhookSecret',
						type: 'string',
						typeOptions: {
							password: true,
						},
						default: '',
						description: 'Secret for validating webhook signatures',
					},
				],
			},
		],
	};

	/**
	 * Log licensing notice once per node load
	 */
	private static licenseNoticeLogged = false;

	private logLicenseNotice(): void {
		if (!R1RcmTrigger.licenseNoticeLogged) {
			console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
			R1RcmTrigger.licenseNoticeLogged = true;
		}
	}

	/**
	 * Register webhook with R1 RCM when workflow is activated
	 */
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;

				if (webhookData.webhookId === undefined) {
					return false;
				}

				try {
					const credentials = await this.getCredentials('r1RcmApi');
					const { R1RcmClient } = await import('./transport/r1RcmClient');
					const client = new R1RcmClient(credentials);

					const response = await client.request('GET', `/webhooks/${webhookData.webhookId}`);

					// Verify webhook still exists and matches configuration
					if (response.url === webhookUrl && response.events?.includes(event)) {
						return true;
					}
				} catch {
					// Webhook no longer exists
				}

				delete webhookData.webhookId;
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				// Log license notice
				const trigger = new R1RcmTrigger();
				trigger.logLicenseNotice();

				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;
				const eventCategory = this.getNodeParameter('eventCategory') as string;
				const filterOptions = this.getNodeParameter('filterOptions', {}) as IDataObject;
				const options = this.getNodeParameter('options', {}) as IDataObject;

				// Build webhook payload
				const payload: IDataObject = {
					name: `n8n-${eventCategory}-${Date.now()}`,
					url: webhookUrl,
					events: [event],
					enabled: true,
				};

				// Add filters
				const filters: IDataObject = {};
				if (filterOptions.facilityIds) {
					filters.facilities = (filterOptions.facilityIds as string).split(',').map(s => s.trim());
				}
				if (filterOptions.providerIds) {
					filters.providers = (filterOptions.providerIds as string).split(',').map(s => s.trim());
				}
				if (filterOptions.payerIds) {
					filters.payers = (filterOptions.payerIds as string).split(',').map(s => s.trim());
				}
				if (filterOptions.minimumAmount && (filterOptions.minimumAmount as number) > 0) {
					filters.minimumAmount = filterOptions.minimumAmount;
				}
				if (Object.keys(filters).length > 0) {
					payload.filters = filters;
				}

				// Add secret if provided
				if (options.webhookSecret) {
					payload.secret = options.webhookSecret;
				}

				try {
					const credentials = await this.getCredentials('r1RcmApi');
					const { R1RcmClient } = await import('./transport/r1RcmClient');
					const client = new R1RcmClient(credentials);

					const response = await client.request('POST', '/webhooks', payload);

					const webhookData = this.getWorkflowStaticData('node');
					webhookData.webhookId = response.id;

					return true;
				} catch (error) {
					throw new Error(`Failed to create webhook: ${(error as Error).message}`);
				}
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					try {
						const credentials = await this.getCredentials('r1RcmApi');
						const { R1RcmClient } = await import('./transport/r1RcmClient');
						const client = new R1RcmClient(credentials);

						await client.request('DELETE', `/webhooks/${webhookData.webhookId}`);
					} catch (error) {
						// Log but don't fail - webhook may already be deleted
						console.error(`Failed to delete webhook: ${(error as Error).message}`);
					}

					delete webhookData.webhookId;
				}

				return true;
			},
		},
	};

	/**
	 * Process incoming webhook events
	 */
	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const options = this.getNodeParameter('options', {}) as IDataObject;

		// Validate webhook signature if secret is configured
		if (options.webhookSecret) {
			const signature = req.headers['x-r1rcm-signature'] as string;
			if (signature) {
				const crypto = require('crypto');
				const expectedSignature = crypto
					.createHmac('sha256', options.webhookSecret as string)
					.update(JSON.stringify(body))
					.digest('hex');

				if (signature !== `sha256=${expectedSignature}`) {
					return {
						webhookResponse: { status: 401, body: 'Invalid signature' },
					};
				}
			}
		}

		// Extract event data
		const eventData: IDataObject = {
			eventId: body.id || body.eventId,
			eventType: body.type || body.eventType,
			timestamp: body.timestamp || body.createdAt || new Date().toISOString(),
			data: body.data || body.payload || body,
		};

		// Add metadata
		eventData.metadata = {
			facilityId: body.facilityId,
			providerId: body.providerId,
			patientId: body.patientId,
			claimId: body.claimId,
			encounterId: body.encounterId,
		};

		// Include raw payload if requested
		if (options.includeRawPayload) {
			eventData.rawPayload = body;
		}

		return {
			workflowData: [this.helpers.returnJsonArray([eventData])],
		};
	}
}
