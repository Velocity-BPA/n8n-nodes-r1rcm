/* Copyright (c) Velocity BPA, LLC. Licensed under the Business Source License 1.1. See LICENSE file for details. Commercial use requires a separate license from Velocity BPA. */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

// Import action operations and fields
import { patientAccessOperations, patientAccessFields, executePatientAccess } from './actions/patientAccess';
import { registrationOperations, registrationFields, executeRegistration } from './actions/registration';
import { eligibilityOperations, eligibilityFields, executeEligibility } from './actions/eligibility';
import { priorAuthOperations, priorAuthFields, executePriorAuth } from './actions/priorAuth';
import { chargeCaptureOperations, chargeCaptureFields, executeChargeCapture } from './actions/chargeCapture';
import { codingOperations, codingFields, executeCoding } from './actions/coding';
import { claimOperations, claimFields, executeClaim } from './actions/claim';
import { denialOperations, denialFields, executeDenial } from './actions/denial';
import { paymentOperations, paymentFields, executePayment } from './actions/payment';
import { arManagementOperations, arManagementFields, executeArManagement } from './actions/arManagement';
import { workQueueOperations, workQueueFields, executeWorkQueue } from './actions/workQueue';
import { analyticsOperations, analyticsFields, executeAnalytics } from './actions/analytics';
import { reportingOperations, reportingFields, executeReporting } from './actions/reporting';
import { epicIntegrationOperations, epicIntegrationFields, executeEpicIntegration } from './actions/epicIntegration';
import { contractOperations, contractFields, executeContract } from './actions/contract';
import { providerOperations, providerFields, executeProvider } from './actions/provider';
import { facilityOperations, facilityFields, executeFacility } from './actions/facility';
import { payerOperations, payerFields, executePayer } from './actions/payer';
import { automationOperations, automationFields, executeAutomation } from './actions/automation';
import { sftpOperations, sftpFields, executeSftp } from './actions/sftp';
import { webhookOperations, webhookFields, executeWebhook } from './actions/webhook';
import { utilityOperations, utilityFields, executeUtility } from './actions/utility';

/**
 * R1 RCM Community Node for n8n
 * 
 * A comprehensive integration with R1 RCM's revenue cycle management platform,
 * providing 22 resources and 200+ operations for healthcare revenue cycle automation.
 * 
 * Key capabilities:
 * - Patient Access & Registration
 * - Eligibility Verification (270/271)
 * - Prior Authorization (278)
 * - Charge Capture & Coding
 * - Claim Submission (837P/I/D)
 * - Claim Status (276/277)
 * - Denial Management & Appeals
 * - Payment Posting (835)
 * - A/R Management
 * - Epic EHR Integration
 * - Analytics & Reporting
 * - Intelligent Automation
 */
export class R1Rcm implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'R1 RCM',
		name: 'r1Rcm',
		icon: 'file:r1rcm.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Healthcare revenue cycle management with R1 RCM - patient access, eligibility, claims, denials, payments, and Epic integration',
		defaults: {
			name: 'R1 RCM',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'r1RcmApi',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'patientAccess',
							'registration',
							'eligibility',
							'priorAuth',
							'chargeCapture',
							'coding',
							'claim',
							'denial',
							'payment',
							'arManagement',
							'workQueue',
							'analytics',
							'reporting',
							'contract',
							'provider',
							'facility',
							'payer',
							'automation',
							'webhook',
							'utility',
						],
					},
				},
			},
			{
				name: 'r1RcmIntegration',
				required: true,
				displayOptions: {
					show: {
						resource: ['epicIntegration'],
					},
				},
			},
			{
				name: 'r1RcmSftp',
				required: true,
				displayOptions: {
					show: {
						resource: ['sftp'],
					},
				},
			},
		],
		properties: [
			// License notice (displayed at node configuration level)
			{
				displayName: 'This node is licensed under BSL 1.1. Commercial use by for-profit organizations requires a license from Velocity BPA. Visit velobpa.com/licensing for details.',
				name: 'licenseNotice',
				type: 'notice',
				default: '',
			},
			// Resource selector
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Analytics',
						value: 'analytics',
						description: 'Revenue cycle analytics and KPIs',
					},
					{
						name: 'A/R Management',
						value: 'arManagement',
						description: 'Accounts receivable management',
					},
					{
						name: 'Automation',
						value: 'automation',
						description: 'Intelligent automation and RPA',
					},
					{
						name: 'Charge Capture',
						value: 'chargeCapture',
						description: 'Charge capture and review',
					},
					{
						name: 'Claim',
						value: 'claim',
						description: 'Claim submission and management (837)',
					},
					{
						name: 'Coding',
						value: 'coding',
						description: 'Medical coding operations',
					},
					{
						name: 'Contract',
						value: 'contract',
						description: 'Payer contract management',
					},
					{
						name: 'Denial',
						value: 'denial',
						description: 'Denial management and appeals',
					},
					{
						name: 'Eligibility',
						value: 'eligibility',
						description: 'Eligibility verification (270/271)',
					},
					{
						name: 'Epic Integration',
						value: 'epicIntegration',
						description: 'Epic EHR integration (HL7/FHIR)',
					},
					{
						name: 'Facility',
						value: 'facility',
						description: 'Facility management and metrics',
					},
					{
						name: 'Patient Access',
						value: 'patientAccess',
						description: 'Patient registration and access',
					},
					{
						name: 'Payer',
						value: 'payer',
						description: 'Payer management and rules',
					},
					{
						name: 'Payment',
						value: 'payment',
						description: 'Payment posting (835)',
					},
					{
						name: 'Prior Authorization',
						value: 'priorAuth',
						description: 'Prior authorization (278)',
					},
					{
						name: 'Provider',
						value: 'provider',
						description: 'Provider management and credentialing',
					},
					{
						name: 'Registration',
						value: 'registration',
						description: 'Patient registration workflow',
					},
					{
						name: 'Reporting',
						value: 'reporting',
						description: 'Report generation and scheduling',
					},
					{
						name: 'SFTP',
						value: 'sftp',
						description: 'Secure file transfer (EDI files)',
					},
					{
						name: 'Utility',
						value: 'utility',
						description: 'Validation and utility functions',
					},
					{
						name: 'Webhook',
						value: 'webhook',
						description: 'Webhook subscriptions',
					},
					{
						name: 'Work Queue',
						value: 'workQueue',
						description: 'Work queue management',
					},
				],
				default: 'patientAccess',
			},

			// Operations for each resource
			...patientAccessOperations,
			...registrationOperations,
			...eligibilityOperations,
			...priorAuthOperations,
			...chargeCaptureOperations,
			...codingOperations,
			...claimOperations,
			...denialOperations,
			...paymentOperations,
			...arManagementOperations,
			...workQueueOperations,
			...analyticsOperations,
			...reportingOperations,
			...epicIntegrationOperations,
			...contractOperations,
			...providerOperations,
			...facilityOperations,
			...payerOperations,
			...automationOperations,
			...sftpOperations,
			...webhookOperations,
			...utilityOperations,

			// Fields for each resource
			...patientAccessFields,
			...registrationFields,
			...eligibilityFields,
			...priorAuthFields,
			...chargeCaptureFields,
			...codingFields,
			...claimFields,
			...denialFields,
			...paymentFields,
			...arManagementFields,
			...workQueueFields,
			...analyticsFields,
			...reportingFields,
			...epicIntegrationFields,
			...contractFields,
			...providerFields,
			...facilityFields,
			...payerFields,
			...automationFields,
			...sftpFields,
			...webhookFields,
			...utilityFields,
		],
	};

	/**
	 * Log licensing notice once per node load
	 */
	private static licenseNoticeLogged = false;

	private logLicenseNotice(): void {
		if (!R1Rcm.licenseNoticeLogged) {
			console.warn(`
[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.
`);
			R1Rcm.licenseNoticeLogged = true;
		}
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Log license notice once per node load (non-blocking)
		const node = new R1Rcm();
		node.logLicenseNotice();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		// Process each input item
		for (let i = 0; i < items.length; i++) {
			try {
				let result: IDataObject;

				// Route to appropriate resource handler
				switch (resource) {
					case 'patientAccess':
						result = await executePatientAccess.call(this, i);
						break;

					case 'registration':
						result = await executeRegistration.call(this, i);
						break;

					case 'eligibility':
						result = await executeEligibility.call(this, i);
						break;

					case 'priorAuth':
						result = await executePriorAuth.call(this, i);
						break;

					case 'chargeCapture':
						result = await executeChargeCapture.call(this, i);
						break;

					case 'coding':
						result = await executeCoding.call(this, i);
						break;

					case 'claim':
						result = await executeClaim.call(this, i);
						break;

					case 'denial':
						result = await executeDenial.call(this, i);
						break;

					case 'payment':
						result = await executePayment.call(this, i);
						break;

					case 'arManagement':
						result = await executeArManagement.call(this, i);
						break;

					case 'workQueue':
						result = await executeWorkQueue.call(this, i);
						break;

					case 'analytics':
						result = await executeAnalytics.call(this, i);
						break;

					case 'reporting':
						result = await executeReporting.call(this, i);
						break;

					case 'epicIntegration':
						result = await executeEpicIntegration.call(this, i);
						break;

					case 'contract':
						result = await executeContract.call(this, i);
						break;

					case 'provider':
						result = await executeProvider.call(this, i);
						break;

					case 'facility':
						result = await executeFacility.call(this, i);
						break;

					case 'payer':
						result = await executePayer.call(this, i);
						break;

					case 'automation':
						result = await executeAutomation.call(this, i);
						break;

					case 'sftp':
						result = await executeSftp.call(this, i);
						break;

					case 'webhook':
						result = await executeWebhook.call(this, i);
						break;

					case 'utility':
						result = await executeUtility.call(this, i);
						break;

					default:
						throw new Error(`Unknown resource: ${resource}`);
				}

				// Add result to output
				returnData.push({
					json: result,
					pairedItem: { item: i },
				});

			} catch (error) {
				// Handle errors with option to continue on fail
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
							resource,
							operation: this.getNodeParameter('operation', i) as string,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
