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

// Epic Integration Resource Operations
export const epicIntegrationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
			},
		},
		options: [
			{
				name: 'Get Epic Patient',
				value: 'getEpicPatient',
				description: 'Retrieve patient data from Epic EHR',
				action: 'Get patient from Epic EHR',
			},
			{
				name: 'Sync Patient Data',
				value: 'syncPatientData',
				description: 'Synchronize patient data between R1 and Epic',
				action: 'Sync patient data with Epic',
			},
			{
				name: 'Get Epic Encounter',
				value: 'getEpicEncounter',
				description: 'Retrieve encounter from Epic EHR',
				action: 'Get encounter from Epic',
			},
			{
				name: 'Get Epic Charges',
				value: 'getEpicCharges',
				description: 'Retrieve charges from Epic EHR',
				action: 'Get charges from Epic',
			},
			{
				name: 'Send to Epic',
				value: 'sendToEpic',
				description: 'Send data to Epic EHR via FHIR',
				action: 'Send data to Epic',
			},
			{
				name: 'Get Epic Status',
				value: 'getEpicStatus',
				description: 'Check Epic integration status',
				action: 'Get Epic integration status',
			},
			{
				name: 'Reconcile Epic Data',
				value: 'reconcileEpicData',
				description: 'Reconcile data discrepancies between R1 and Epic',
				action: 'Reconcile Epic data',
			},
			{
				name: 'Get Epic Queue',
				value: 'getEpicQueue',
				description: 'Get Epic integration queue items',
				action: 'Get Epic queue',
			},
		],
		default: 'getEpicPatient',
	},
];

// Epic Integration Resource Fields
export const epicIntegrationFields: INodeProperties[] = [
	// ----------------------------------
	//         getEpicPatient
	// ----------------------------------
	{
		displayName: 'Epic Patient ID',
		name: 'epicPatientId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicPatient'],
			},
		},
		default: '',
		description: 'The Epic MRN or FHIR Patient ID',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicPatient'],
			},
		},
		options: [
			{
				displayName: 'Include Demographics',
				name: 'includeDemographics',
				type: 'boolean',
				default: true,
				description: 'Whether to include full demographic data',
			},
			{
				displayName: 'Include Insurance',
				name: 'includeInsurance',
				type: 'boolean',
				default: true,
				description: 'Whether to include insurance coverage information',
			},
			{
				displayName: 'Include Encounters',
				name: 'includeEncounters',
				type: 'boolean',
				default: false,
				description: 'Whether to include recent encounters',
			},
		],
	},

	// ----------------------------------
	//         syncPatientData
	// ----------------------------------
	{
		displayName: 'Patient ID',
		name: 'patientId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['syncPatientData'],
			},
		},
		default: '',
		description: 'The R1 patient ID to sync',
	},
	{
		displayName: 'Sync Direction',
		name: 'syncDirection',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['syncPatientData'],
			},
		},
		options: [
			{
				name: 'Epic to R1',
				value: 'epicToR1',
				description: 'Pull data from Epic to R1',
			},
			{
				name: 'R1 to Epic',
				value: 'r1ToEpic',
				description: 'Push data from R1 to Epic',
			},
			{
				name: 'Bidirectional',
				value: 'bidirectional',
				description: 'Sync in both directions with conflict resolution',
			},
		],
		default: 'epicToR1',
		description: 'Direction of the data synchronization',
	},
	{
		displayName: 'Data Types',
		name: 'dataTypes',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['syncPatientData'],
			},
		},
		options: [
			{
				name: 'Demographics',
				value: 'demographics',
			},
			{
				name: 'Insurance',
				value: 'insurance',
			},
			{
				name: 'Guarantor',
				value: 'guarantor',
			},
			{
				name: 'Contacts',
				value: 'contacts',
			},
			{
				name: 'Allergies',
				value: 'allergies',
			},
			{
				name: 'Problems',
				value: 'problems',
			},
		],
		default: ['demographics', 'insurance'],
		description: 'Types of data to synchronize',
	},
	{
		displayName: 'Conflict Resolution',
		name: 'conflictResolution',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['syncPatientData'],
				syncDirection: ['bidirectional'],
			},
		},
		options: [
			{
				name: 'Epic Wins',
				value: 'epicWins',
				description: 'Epic data takes precedence in conflicts',
			},
			{
				name: 'R1 Wins',
				value: 'r1Wins',
				description: 'R1 data takes precedence in conflicts',
			},
			{
				name: 'Most Recent',
				value: 'mostRecent',
				description: 'Most recently updated data wins',
			},
			{
				name: 'Manual Review',
				value: 'manualReview',
				description: 'Flag conflicts for manual review',
			},
		],
		default: 'epicWins',
		description: 'How to handle data conflicts',
	},

	// ----------------------------------
	//         getEpicEncounter
	// ----------------------------------
	{
		displayName: 'Encounter ID',
		name: 'encounterId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicEncounter'],
			},
		},
		default: '',
		description: 'The Epic encounter ID (CSN)',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicEncounter'],
			},
		},
		options: [
			{
				displayName: 'Include Diagnoses',
				name: 'includeDiagnoses',
				type: 'boolean',
				default: true,
				description: 'Whether to include encounter diagnoses',
			},
			{
				displayName: 'Include Procedures',
				name: 'includeProcedures',
				type: 'boolean',
				default: true,
				description: 'Whether to include encounter procedures',
			},
			{
				displayName: 'Include Providers',
				name: 'includeProviders',
				type: 'boolean',
				default: true,
				description: 'Whether to include attending/billing providers',
			},
			{
				displayName: 'Include Charges',
				name: 'includeCharges',
				type: 'boolean',
				default: false,
				description: 'Whether to include associated charges',
			},
		],
	},

	// ----------------------------------
	//         getEpicCharges
	// ----------------------------------
	{
		displayName: 'Filter By',
		name: 'filterBy',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicCharges'],
			},
		},
		options: [
			{
				name: 'Encounter',
				value: 'encounter',
			},
			{
				name: 'Patient',
				value: 'patient',
			},
			{
				name: 'Date Range',
				value: 'dateRange',
			},
		],
		default: 'encounter',
		description: 'How to filter charges',
	},
	{
		displayName: 'Encounter ID',
		name: 'encounterId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicCharges'],
				filterBy: ['encounter'],
			},
		},
		default: '',
		description: 'The Epic encounter ID (CSN)',
	},
	{
		displayName: 'Patient ID',
		name: 'patientId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicCharges'],
				filterBy: ['patient'],
			},
		},
		default: '',
		description: 'The Epic patient ID (MRN)',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicCharges'],
				filterBy: ['dateRange'],
			},
		},
		default: '',
		description: 'Start of the date range for charges',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicCharges'],
				filterBy: ['dateRange'],
			},
		},
		default: '',
		description: 'End of the date range for charges',
	},

	// ----------------------------------
	//         sendToEpic
	// ----------------------------------
	{
		displayName: 'Resource Type',
		name: 'resourceType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['sendToEpic'],
			},
		},
		options: [
			{
				name: 'Patient',
				value: 'Patient',
			},
			{
				name: 'Coverage',
				value: 'Coverage',
			},
			{
				name: 'Account',
				value: 'Account',
			},
			{
				name: 'Claim',
				value: 'Claim',
			},
			{
				name: 'Payment Notice',
				value: 'PaymentNotice',
			},
			{
				name: 'Communication',
				value: 'Communication',
			},
		],
		default: 'Patient',
		description: 'The FHIR resource type to send',
	},
	{
		displayName: 'Resource Data',
		name: 'resourceData',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['sendToEpic'],
			},
		},
		default: '{}',
		description: 'The FHIR resource data to send to Epic',
	},
	{
		displayName: 'Operation',
		name: 'fhirOperation',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['sendToEpic'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
			},
			{
				name: 'Update',
				value: 'update',
			},
			{
				name: 'Upsert',
				value: 'upsert',
			},
		],
		default: 'create',
		description: 'The FHIR operation to perform',
	},

	// ----------------------------------
	//         getEpicStatus
	// ----------------------------------
	{
		displayName: 'Status Type',
		name: 'statusType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicStatus'],
			},
		},
		options: [
			{
				name: 'Connection Health',
				value: 'connection',
				description: 'Check Epic connection health',
			},
			{
				name: 'Sync Status',
				value: 'sync',
				description: 'Get sync job status',
			},
			{
				name: 'Queue Status',
				value: 'queue',
				description: 'Get integration queue status',
			},
			{
				name: 'Error Summary',
				value: 'errors',
				description: 'Get recent error summary',
			},
		],
		default: 'connection',
		description: 'Type of status to retrieve',
	},
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicStatus'],
				statusType: ['sync'],
			},
		},
		default: '',
		description: 'Specific sync job ID to check (leave empty for latest)',
	},

	// ----------------------------------
	//         reconcileEpicData
	// ----------------------------------
	{
		displayName: 'Reconciliation Type',
		name: 'reconciliationType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['reconcileEpicData'],
			},
		},
		options: [
			{
				name: 'Patient Demographics',
				value: 'demographics',
			},
			{
				name: 'Insurance Coverage',
				value: 'coverage',
			},
			{
				name: 'Encounter Data',
				value: 'encounter',
			},
			{
				name: 'Charge Data',
				value: 'charges',
			},
			{
				name: 'Full Reconciliation',
				value: 'full',
			},
		],
		default: 'demographics',
		description: 'Type of data to reconcile',
	},
	{
		displayName: 'Patient ID',
		name: 'patientId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['reconcileEpicData'],
			},
		},
		default: '',
		description: 'Patient ID to reconcile (leave empty for batch)',
	},
	{
		displayName: 'Auto Resolve',
		name: 'autoResolve',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['reconcileEpicData'],
			},
		},
		default: false,
		description: 'Whether to automatically resolve simple discrepancies',
	},

	// ----------------------------------
	//         getEpicQueue
	// ----------------------------------
	{
		displayName: 'Queue Type',
		name: 'queueType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicQueue'],
			},
		},
		options: [
			{
				name: 'Inbound',
				value: 'inbound',
				description: 'Messages from Epic to R1',
			},
			{
				name: 'Outbound',
				value: 'outbound',
				description: 'Messages from R1 to Epic',
			},
			{
				name: 'Failed',
				value: 'failed',
				description: 'Failed messages requiring attention',
			},
			{
				name: 'All',
				value: 'all',
				description: 'All queue items',
			},
		],
		default: 'failed',
		description: 'Type of queue to retrieve',
	},
	{
		displayName: 'Message Type',
		name: 'messageType',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicQueue'],
			},
		},
		options: [
			{
				name: 'ADT (Admit/Discharge/Transfer)',
				value: 'ADT',
			},
			{
				name: 'DFT (Charge)',
				value: 'DFT',
			},
			{
				name: 'BAR (Billing Account)',
				value: 'BAR',
			},
			{
				name: 'SIU (Scheduling)',
				value: 'SIU',
			},
			{
				name: 'ORU (Results)',
				value: 'ORU',
			},
			{
				name: 'FHIR',
				value: 'FHIR',
			},
		],
		default: [],
		description: 'Filter by message types',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['epicIntegration'],
				operation: ['getEpicQueue'],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 500,
		},
		default: 50,
		description: 'Maximum number of queue items to return',
	},
];

// Execute Epic Integration operations
export async function executeEpicIntegration(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	let responseData;

	switch (operation) {
		case 'getEpicPatient': {
			const epicPatientId = this.getNodeParameter('epicPatientId', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				includeDemographics?: boolean;
				includeInsurance?: boolean;
				includeEncounters?: boolean;
			};

			const queryParams: Record<string, string | boolean> = {};
			if (options.includeDemographics !== undefined) {
				queryParams.includeDemographics = options.includeDemographics;
			}
			if (options.includeInsurance !== undefined) {
				queryParams.includeInsurance = options.includeInsurance;
			}
			if (options.includeEncounters !== undefined) {
				queryParams.includeEncounters = options.includeEncounters;
			}

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.EPIC.PATIENTS}/${epicPatientId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'syncPatientData': {
			const patientId = this.getNodeParameter('patientId', index) as string;
			const syncDirection = this.getNodeParameter('syncDirection', index) as string;
			const dataTypes = this.getNodeParameter('dataTypes', index, []) as string[];
			const conflictResolution = syncDirection === 'bidirectional'
				? this.getNodeParameter('conflictResolution', index) as string
				: 'epicWins';

			const body = {
				patientId,
				syncDirection,
				dataTypes,
				conflictResolution,
			};

			responseData = await r1RcmApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.EPIC.SYNC}`,
				body,
			);
			break;
		}

		case 'getEpicEncounter': {
			const encounterId = this.getNodeParameter('encounterId', index) as string;
			const options = this.getNodeParameter('options', index, {}) as {
				includeDiagnoses?: boolean;
				includeProcedures?: boolean;
				includeProviders?: boolean;
				includeCharges?: boolean;
			};

			const queryParams: Record<string, string | boolean> = {};
			Object.entries(options).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams[key] = value;
				}
			});

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.EPIC.ENCOUNTERS}/${encounterId}`,
				{},
				queryParams,
			);
			break;
		}

		case 'getEpicCharges': {
			const filterBy = this.getNodeParameter('filterBy', index) as string;
			const queryParams: Record<string, string> = {};

			if (filterBy === 'encounter') {
				queryParams.encounterId = this.getNodeParameter('encounterId', index) as string;
			} else if (filterBy === 'patient') {
				queryParams.patientId = this.getNodeParameter('patientId', index) as string;
			} else if (filterBy === 'dateRange') {
				queryParams.startDate = this.getNodeParameter('startDate', index) as string;
				queryParams.endDate = this.getNodeParameter('endDate', index) as string;
			}

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.EPIC.CHARGES}`,
				{},
				queryParams,
			);
			break;
		}

		case 'sendToEpic': {
			const resourceType = this.getNodeParameter('resourceType', index) as string;
			const resourceData = this.getNodeParameter('resourceData', index) as object;
			const fhirOperation = this.getNodeParameter('fhirOperation', index, 'create') as string;

			const body = {
				resourceType,
				data: resourceData,
				operation: fhirOperation,
			};

			responseData = await r1RcmApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.EPIC.FHIR}`,
				body,
			);
			break;
		}

		case 'getEpicStatus': {
			const statusType = this.getNodeParameter('statusType', index) as string;
			const queryParams: Record<string, string> = { type: statusType };

			if (statusType === 'sync') {
				const jobId = this.getNodeParameter('jobId', index, '') as string;
				if (jobId) {
					queryParams.jobId = jobId;
				}
			}

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.EPIC.STATUS}`,
				{},
				queryParams,
			);
			break;
		}

		case 'reconcileEpicData': {
			const reconciliationType = this.getNodeParameter('reconciliationType', index) as string;
			const patientId = this.getNodeParameter('patientId', index, '') as string;
			const autoResolve = this.getNodeParameter('autoResolve', index, false) as boolean;

			const body: Record<string, string | boolean> = {
				reconciliationType,
				autoResolve,
			};

			if (patientId) {
				body.patientId = patientId;
			}

			responseData = await r1RcmApiRequest.call(
				this,
				'POST',
				`${ENDPOINTS.EPIC.RECONCILE}`,
				body,
			);
			break;
		}

		case 'getEpicQueue': {
			const queueType = this.getNodeParameter('queueType', index, 'failed') as string;
			const messageTypes = this.getNodeParameter('messageType', index, []) as string[];
			const limit = this.getNodeParameter('limit', index, 50) as number;

			const queryParams: Record<string, string | number> = {
				type: queueType,
				limit,
			};

			if (messageTypes.length > 0) {
				queryParams.messageTypes = messageTypes.join(',');
			}

			responseData = await r1RcmApiRequest.call(
				this,
				'GET',
				`${ENDPOINTS.EPIC.QUEUE}`,
				{},
				queryParams,
			);
			break;
		}

		default:
			throw new Error(`Operation ${operation} is not supported for Epic Integration`);
	}

	return this.helpers.returnJsonArray(responseData as object[]);
}
