/* Copyright (c) Velocity BPA, LLC. Licensed under the Business Source License 1.1. See LICENSE file for details. Commercial use requires a separate license from Velocity BPA. */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';

/**
 * Utility Resource Operations
 * 
 * Healthcare utility operations for validation and code lookups:
 * - NPI validation (using Luhn algorithm and NPPES registry)
 * - Tax ID (EIN) validation
 * - Code lookups (ICD-10, CPT, HCPCS)
 * - CARC/RARC code references
 * - Place of Service codes
 * - API connectivity testing
 */

export const utilityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['utility'],
			},
		},
		options: [
			{
				name: 'Validate NPI',
				value: 'validateNpi',
				description: 'Validate a National Provider Identifier',
				action: 'Validate NPI',
			},
			{
				name: 'Validate Tax ID',
				value: 'validateTaxId',
				description: 'Validate an Employer Identification Number (EIN)',
				action: 'Validate Tax ID',
			},
			{
				name: 'Get Code Lookup',
				value: 'getCodeLookup',
				description: 'Look up ICD-10, CPT, or HCPCS codes',
				action: 'Get code lookup',
			},
			{
				name: 'Get CARC/RARC Codes',
				value: 'getCarcRarcCodes',
				description: 'Look up Claim Adjustment Reason Codes',
				action: 'Get CARC RARC codes',
			},
			{
				name: 'Get Place of Service Codes',
				value: 'getPlaceOfServiceCodes',
				description: 'Look up Place of Service codes',
				action: 'Get place of service codes',
			},
			{
				name: 'Test Connection',
				value: 'testConnection',
				description: 'Test connection to R1 RCM API',
				action: 'Test connection',
			},
			{
				name: 'Get API Status',
				value: 'getApiStatus',
				description: 'Get R1 RCM API status and health',
				action: 'Get API status',
			},
		],
		default: 'testConnection',
	},
];

export const utilityFields: INodeProperties[] = [
	// Validate NPI fields
	{
		displayName: 'NPI',
		name: 'npi',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateNpi'],
			},
		},
		default: '',
		placeholder: '1234567893',
		description: 'National Provider Identifier to validate (10 digits)',
	},
	{
		displayName: 'NPI Validation Options',
		name: 'npiValidationOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateNpi'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Check NPPES Registry',
				name: 'checkNppesRegistry',
				type: 'boolean',
				default: true,
				description: 'Whether to verify NPI against CMS NPPES registry',
			},
			{
				displayName: 'Include Provider Details',
				name: 'includeProviderDetails',
				type: 'boolean',
				default: true,
				description: 'Whether to include provider details from NPPES if valid',
			},
			{
				displayName: 'Check Enrollment Status',
				name: 'checkEnrollmentStatus',
				type: 'boolean',
				default: false,
				description: 'Whether to check provider enrollment status with payers',
			},
		],
	},

	// Validate Tax ID fields
	{
		displayName: 'Tax ID',
		name: 'taxId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateTaxId'],
			},
		},
		default: '',
		placeholder: '12-3456789',
		description: 'Employer Identification Number (EIN) to validate',
	},
	{
		displayName: 'Tax ID Type',
		name: 'taxIdType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateTaxId'],
			},
		},
		options: [
			{
				name: 'EIN (Employer ID)',
				value: 'EIN',
				description: 'Employer Identification Number',
			},
			{
				name: 'SSN (Social Security)',
				value: 'SSN',
				description: 'Social Security Number (for sole proprietors)',
			},
		],
		default: 'EIN',
		description: 'Type of tax identification number',
	},
	{
		displayName: 'Tax ID Validation Options',
		name: 'taxIdValidationOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['validateTaxId'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Validate Format Only',
				name: 'validateFormatOnly',
				type: 'boolean',
				default: false,
				description: 'Whether to only validate format without registry check',
			},
		],
	},

	// Get Code Lookup fields
	{
		displayName: 'Code Type',
		name: 'codeType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getCodeLookup'],
			},
		},
		options: [
			{
				name: 'ICD-10-CM (Diagnosis)',
				value: 'ICD10CM',
				description: 'ICD-10 Clinical Modification diagnosis codes',
			},
			{
				name: 'ICD-10-PCS (Procedure)',
				value: 'ICD10PCS',
				description: 'ICD-10 Procedure Coding System codes',
			},
			{
				name: 'CPT (Professional)',
				value: 'CPT',
				description: 'Current Procedural Terminology codes',
			},
			{
				name: 'HCPCS Level II',
				value: 'HCPCS',
				description: 'Healthcare Common Procedure Coding System',
			},
			{
				name: 'DRG (MS-DRG)',
				value: 'DRG',
				description: 'Medicare Severity Diagnosis Related Groups',
			},
			{
				name: 'Revenue Code',
				value: 'REVENUE',
				description: 'UB-04 Revenue Codes',
			},
			{
				name: 'Modifier',
				value: 'MODIFIER',
				description: 'CPT/HCPCS Modifiers',
			},
			{
				name: 'Taxonomy',
				value: 'TAXONOMY',
				description: 'Provider Taxonomy Codes',
			},
		],
		default: 'ICD10CM',
		description: 'Type of code to look up',
	},
	{
		displayName: 'Search Mode',
		name: 'searchMode',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getCodeLookup'],
			},
		},
		options: [
			{
				name: 'Exact Code',
				value: 'exact',
				description: 'Look up a specific code',
			},
			{
				name: 'Search by Description',
				value: 'description',
				description: 'Search codes by description text',
			},
			{
				name: 'Search by Category',
				value: 'category',
				description: 'Browse codes by category/chapter',
			},
		],
		default: 'exact',
		description: 'How to search for codes',
	},
	{
		displayName: 'Code',
		name: 'code',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getCodeLookup'],
				searchMode: ['exact'],
			},
		},
		default: '',
		placeholder: 'E11.9',
		description: 'Code to look up',
	},
	{
		displayName: 'Search Text',
		name: 'searchText',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getCodeLookup'],
				searchMode: ['description'],
			},
		},
		default: '',
		placeholder: 'diabetes mellitus',
		description: 'Text to search in code descriptions',
	},
	{
		displayName: 'Category',
		name: 'category',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getCodeLookup'],
				searchMode: ['category'],
			},
		},
		default: '',
		placeholder: 'E10-E14',
		description: 'Category or chapter to browse',
	},
	{
		displayName: 'Code Lookup Options',
		name: 'codeLookupOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getCodeLookup'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Include Related Codes',
				name: 'includeRelatedCodes',
				type: 'boolean',
				default: false,
				description: 'Whether to include related or similar codes',
			},
			{
				displayName: 'Include CCI Edits',
				name: 'includeCciEdits',
				type: 'boolean',
				default: false,
				description: 'Whether to include Correct Coding Initiative edits (for procedure codes)',
			},
			{
				displayName: 'Include LCD/NCD',
				name: 'includeLcdNcd',
				type: 'boolean',
				default: false,
				description: 'Whether to include coverage determination info',
			},
			{
				displayName: 'Include Fee Schedule',
				name: 'includeFeeSchedule',
				type: 'boolean',
				default: false,
				description: 'Whether to include Medicare fee schedule rates',
			},
			{
				displayName: 'Effective Date',
				name: 'effectiveDate',
				type: 'dateTime',
				default: '',
				description: 'Get code information as of this date',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Maximum number of results to return',
			},
		],
	},

	// Get CARC/RARC Codes fields
	{
		displayName: 'Reason Code Type',
		name: 'reasonCodeType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getCarcRarcCodes'],
			},
		},
		options: [
			{
				name: 'CARC (Claim Adjustment)',
				value: 'CARC',
				description: 'Claim Adjustment Reason Codes',
			},
			{
				name: 'RARC (Remittance Advice)',
				value: 'RARC',
				description: 'Remittance Advice Remark Codes',
			},
			{
				name: 'Both',
				value: 'BOTH',
				description: 'Both CARC and RARC codes',
			},
			{
				name: 'Group Code',
				value: 'GROUP',
				description: 'Claim Adjustment Group Codes (CO, PR, OA, CR, PI)',
			},
		],
		default: 'CARC',
		description: 'Type of reason code to retrieve',
	},
	{
		displayName: 'Reason Code',
		name: 'reasonCode',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getCarcRarcCodes'],
			},
		},
		default: '',
		placeholder: '16',
		description: 'Specific code to look up (leave empty for all)',
	},
	{
		displayName: 'CARC Options',
		name: 'carcOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getCarcRarcCodes'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Include Appeal Strategies',
				name: 'includeAppealStrategies',
				type: 'boolean',
				default: true,
				description: 'Whether to include recommended appeal strategies',
			},
			{
				displayName: 'Include Examples',
				name: 'includeExamples',
				type: 'boolean',
				default: false,
				description: 'Whether to include example scenarios',
			},
			{
				displayName: 'Filter by Category',
				name: 'filterByCategory',
				type: 'multiOptions',
				options: [
					{ name: 'Coding/Billing', value: 'coding' },
					{ name: 'Coverage/Eligibility', value: 'coverage' },
					{ name: 'Authorization', value: 'authorization' },
					{ name: 'Timely Filing', value: 'timely_filing' },
					{ name: 'Duplicate', value: 'duplicate' },
					{ name: 'Bundling', value: 'bundling' },
					{ name: 'Medical Necessity', value: 'medical_necessity' },
					{ name: 'Patient Responsibility', value: 'patient_responsibility' },
				],
				default: [],
				description: 'Filter codes by category',
			},
		],
	},

	// Get Place of Service Codes fields
	{
		displayName: 'POS Code',
		name: 'posCode',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getPlaceOfServiceCodes'],
			},
		},
		default: '',
		placeholder: '11',
		description: 'Specific POS code to look up (leave empty for all)',
	},
	{
		displayName: 'POS Options',
		name: 'posOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getPlaceOfServiceCodes'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Filter by Facility Type',
				name: 'filterByFacilityType',
				type: 'multiOptions',
				options: [
					{ name: 'Facility', value: 'facility' },
					{ name: 'Non-Facility', value: 'non_facility' },
				],
				default: [],
				description: 'Filter by facility vs non-facility designation',
			},
			{
				displayName: 'Include Fee Differentials',
				name: 'includeFeeDifferentials',
				type: 'boolean',
				default: false,
				description: 'Whether to include facility/non-facility fee info',
			},
			{
				displayName: 'Include Telehealth Eligible',
				name: 'includeTelehealthEligible',
				type: 'boolean',
				default: false,
				description: 'Whether to flag telehealth-eligible POS codes',
			},
		],
	},

	// Test Connection fields
	{
		displayName: 'Connection Test Options',
		name: 'connectionTestOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['testConnection'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Test SFTP',
				name: 'testSftp',
				type: 'boolean',
				default: false,
				description: 'Whether to also test SFTP connection',
			},
			{
				displayName: 'Test Epic Integration',
				name: 'testEpicIntegration',
				type: 'boolean',
				default: false,
				description: 'Whether to also test Epic integration connection',
			},
			{
				displayName: 'Include Latency',
				name: 'includeLatency',
				type: 'boolean',
				default: true,
				description: 'Whether to measure and report API latency',
			},
		],
	},

	// Get API Status fields
	{
		displayName: 'Status Options',
		name: 'statusOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getApiStatus'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Include All Endpoints',
				name: 'includeAllEndpoints',
				type: 'boolean',
				default: false,
				description: 'Whether to check status of all API endpoints',
			},
			{
				displayName: 'Include Rate Limits',
				name: 'includeRateLimits',
				type: 'boolean',
				default: true,
				description: 'Whether to include rate limit information',
			},
			{
				displayName: 'Include Version Info',
				name: 'includeVersionInfo',
				type: 'boolean',
				default: true,
				description: 'Whether to include API version information',
			},
		],
	},
];

/**
 * Execute utility operations
 */
export async function executeUtilityOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	switch (operation) {
		case 'validateNpi': {
			const npi = this.getNodeParameter('npi', index) as string;
			const npiValidationOptions = this.getNodeParameter('npiValidationOptions', index, {}) as IDataObject;

			// Basic format validation
			const cleanNpi = npi.replace(/\D/g, '');
			if (cleanNpi.length !== 10) {
				return {
					success: false,
					operation: 'validateNpi',
					npi,
					valid: false,
					formatValid: false,
					error: 'NPI must be exactly 10 digits',
				};
			}

			// Luhn algorithm validation
			const luhnValid = validateNpiLuhn(cleanNpi);
			if (!luhnValid) {
				return {
					success: false,
					operation: 'validateNpi',
					npi: cleanNpi,
					valid: false,
					formatValid: true,
					luhnValid: false,
					error: 'NPI failed Luhn check digit validation',
				};
			}

			const result: IDataObject = {
				success: true,
				operation: 'validateNpi',
				npi: cleanNpi,
				valid: true,
				formatValid: true,
				luhnValid: true,
			};

			// Check NPPES registry if requested
			if (npiValidationOptions.checkNppesRegistry !== false) {
				try {
					const credentials = await this.getCredentials('r1RcmApi');
					const { R1RcmClient } = await import('../../transport/r1RcmClient');
					const client = new R1RcmClient(credentials);

					const nppesResponse = await client.request('GET', `/providers/npi/${cleanNpi}/verify`);
					result.nppesRegistered = nppesResponse.registered;
					result.nppesStatus = nppesResponse.status;

					if (npiValidationOptions.includeProviderDetails && nppesResponse.provider) {
						result.providerDetails = {
							name: nppesResponse.provider.name,
							type: nppesResponse.provider.entityType,
							specialty: nppesResponse.provider.primaryTaxonomy,
							address: nppesResponse.provider.practiceAddress,
							enumerationDate: nppesResponse.provider.enumerationDate,
						};
					}

					if (!nppesResponse.registered) {
						result.valid = false;
						result.error = 'NPI not found in NPPES registry';
					}
				} catch (error) {
					result.nppesCheckError = 'Unable to verify with NPPES registry';
				}
			}

			// Check enrollment status if requested
			if (npiValidationOptions.checkEnrollmentStatus) {
				try {
					const credentials = await this.getCredentials('r1RcmApi');
					const { R1RcmClient } = await import('../../transport/r1RcmClient');
					const client = new R1RcmClient(credentials);

					const enrollmentResponse = await client.request('GET', `/providers/npi/${cleanNpi}/enrollment`);
					result.enrollmentStatus = enrollmentResponse;
				} catch (error) {
					result.enrollmentCheckError = 'Unable to check enrollment status';
				}
			}

			return result;
		}

		case 'validateTaxId': {
			const taxId = this.getNodeParameter('taxId', index) as string;
			const taxIdType = this.getNodeParameter('taxIdType', index) as string;
			const taxIdValidationOptions = this.getNodeParameter('taxIdValidationOptions', index, {}) as IDataObject;

			// Clean and validate format
			const cleanTaxId = taxId.replace(/\D/g, '');
			
			let formatValid = false;
			let formatError = '';

			if (taxIdType === 'EIN') {
				// EIN must be 9 digits, first two digits 01-99 (excluding some invalid prefixes)
				if (cleanTaxId.length !== 9) {
					formatError = 'EIN must be exactly 9 digits';
				} else {
					const prefix = parseInt(cleanTaxId.substring(0, 2), 10);
					const invalidPrefixes = [0, 7, 8, 9, 17, 18, 19, 28, 29, 49, 69, 70, 78, 79, 89];
					if (invalidPrefixes.includes(prefix)) {
						formatError = 'Invalid EIN prefix';
					} else {
						formatValid = true;
					}
				}
			} else if (taxIdType === 'SSN') {
				// SSN must be 9 digits, with various invalid patterns
				if (cleanTaxId.length !== 9) {
					formatError = 'SSN must be exactly 9 digits';
				} else if (cleanTaxId.startsWith('000') || cleanTaxId.startsWith('666') || cleanTaxId.startsWith('9')) {
					formatError = 'Invalid SSN prefix';
				} else if (cleanTaxId.substring(3, 5) === '00' || cleanTaxId.substring(5) === '0000') {
					formatError = 'Invalid SSN format';
				} else {
					formatValid = true;
				}
			}

			const result: IDataObject = {
				success: formatValid,
				operation: 'validateTaxId',
				taxId: formatTaxId(cleanTaxId, taxIdType),
				taxIdType,
				formatValid,
			};

			if (!formatValid) {
				result.error = formatError;
			}

			// Format-only validation returns here
			if (taxIdValidationOptions.validateFormatOnly) {
				return result;
			}

			// Additional validation could be added here
			// (actual IRS validation would require additional integrations)

			return result;
		}

		case 'getCodeLookup': {
			const codeType = this.getNodeParameter('codeType', index) as string;
			const searchMode = this.getNodeParameter('searchMode', index) as string;
			const codeLookupOptions = this.getNodeParameter('codeLookupOptions', index, {}) as IDataObject;

			const credentials = await this.getCredentials('r1RcmApi');
			const { R1RcmClient } = await import('../../transport/r1RcmClient');
			const client = new R1RcmClient(credentials);

			let endpoint = `/codes/${codeType.toLowerCase()}`;
			const params: IDataObject = {
				limit: codeLookupOptions.limit || 50,
			};

			if (searchMode === 'exact') {
				const code = this.getNodeParameter('code', index) as string;
				endpoint = `${endpoint}/${encodeURIComponent(code)}`;
			} else if (searchMode === 'description') {
				const searchText = this.getNodeParameter('searchText', index) as string;
				params.search = searchText;
			} else if (searchMode === 'category') {
				const category = this.getNodeParameter('category', index) as string;
				params.category = category;
			}

			if (codeLookupOptions.includeRelatedCodes) params.includeRelated = true;
			if (codeLookupOptions.includeCciEdits) params.includeCci = true;
			if (codeLookupOptions.includeLcdNcd) params.includeCoverage = true;
			if (codeLookupOptions.includeFeeSchedule) params.includeFees = true;
			if (codeLookupOptions.effectiveDate) params.effectiveDate = codeLookupOptions.effectiveDate;

			const response = await client.request('GET', endpoint, undefined, params);

			return {
				success: true,
				operation: 'getCodeLookup',
				codeType,
				searchMode,
				results: response.codes || [response],
				totalResults: response.total || 1,
			};
		}

		case 'getCarcRarcCodes': {
			const reasonCodeType = this.getNodeParameter('reasonCodeType', index) as string;
			const reasonCode = this.getNodeParameter('reasonCode', index, '') as string;
			const carcOptions = this.getNodeParameter('carcOptions', index, {}) as IDataObject;

			const credentials = await this.getCredentials('r1RcmApi');
			const { R1RcmClient } = await import('../../transport/r1RcmClient');
			const client = new R1RcmClient(credentials);

			let endpoint = '/codes/reason';
			const params: IDataObject = {};

			if (reasonCodeType !== 'BOTH') {
				params.type = reasonCodeType;
			}

			if (reasonCode) {
				endpoint = `${endpoint}/${reasonCode}`;
			}

			if (carcOptions.includeAppealStrategies) params.includeAppealStrategies = true;
			if (carcOptions.includeExamples) params.includeExamples = true;
			if (carcOptions.filterByCategory && (carcOptions.filterByCategory as string[]).length > 0) {
				params.categories = (carcOptions.filterByCategory as string[]).join(',');
			}

			const response = await client.request('GET', endpoint, undefined, params);

			// Enhance with appeal strategies if not from API
			const codes = response.codes || [response];
			if (carcOptions.includeAppealStrategies && !codes[0]?.appealStrategy) {
				for (const code of codes) {
					code.appealStrategy = getAppealStrategy(code.code as string);
				}
			}

			return {
				success: true,
				operation: 'getCarcRarcCodes',
				reasonCodeType,
				codes,
				totalCodes: codes.length,
			};
		}

		case 'getPlaceOfServiceCodes': {
			const posCode = this.getNodeParameter('posCode', index, '') as string;
			const posOptions = this.getNodeParameter('posOptions', index, {}) as IDataObject;

			// Built-in POS codes (can be supplemented by API)
			const posCodes = getPlaceOfServiceCodes();
			
			let results = posCode
				? posCodes.filter(p => p.code === posCode)
				: posCodes;

			// Apply filters
			if (posOptions.filterByFacilityType && (posOptions.filterByFacilityType as string[]).length > 0) {
				const facilityTypes = posOptions.filterByFacilityType as string[];
				results = results.filter(p =>
					facilityTypes.includes(p.facilityType)
				);
			}

			// Add telehealth eligibility if requested
			if (posOptions.includeTelehealthEligible) {
				const telehealthEligible = ['02', '10'];
				for (const pos of results) {
					pos.telehealthEligible = telehealthEligible.includes(pos.code);
				}
			}

			return {
				success: true,
				operation: 'getPlaceOfServiceCodes',
				codes: results,
				totalCodes: results.length,
			};
		}

		case 'testConnection': {
			const connectionTestOptions = this.getNodeParameter('connectionTestOptions', index, {}) as IDataObject;

			const results: IDataObject = {
				success: true,
				operation: 'testConnection',
				timestamp: new Date().toISOString(),
				connections: {},
			};

			// Test main API connection
			try {
				const credentials = await this.getCredentials('r1RcmApi');
				const { R1RcmClient } = await import('../../transport/r1RcmClient');
				const client = new R1RcmClient(credentials);

				const startTime = Date.now();
				await client.request('GET', '/health');
				const latency = Date.now() - startTime;

				(results.connections as IDataObject).api = {
					status: 'connected',
					latency: connectionTestOptions.includeLatency ? `${latency}ms` : undefined,
				};
			} catch (error) {
				(results.connections as IDataObject).api = {
					status: 'error',
					error: (error as Error).message,
				};
				results.success = false;
			}

			// Test SFTP if requested
			if (connectionTestOptions.testSftp) {
				try {
					const sftpCredentials = await this.getCredentials('r1RcmSftp');
					const { SftpClient } = await import('../../transport/sftpClient');
					const sftpClient = new SftpClient(sftpCredentials);

					const startTime = Date.now();
					await sftpClient.connect();
					await sftpClient.disconnect();
					const latency = Date.now() - startTime;

					(results.connections as IDataObject).sftp = {
						status: 'connected',
						latency: connectionTestOptions.includeLatency ? `${latency}ms` : undefined,
					};
				} catch (error) {
					(results.connections as IDataObject).sftp = {
						status: 'error',
						error: (error as Error).message,
					};
				}
			}

			// Test Epic integration if requested
			if (connectionTestOptions.testEpicIntegration) {
				try {
					const integrationCredentials = await this.getCredentials('r1RcmIntegration');
					const { EpicClient } = await import('../../transport/epicClient');
					const epicClient = new EpicClient(integrationCredentials);

					const startTime = Date.now();
					await epicClient.testConnection();
					const latency = Date.now() - startTime;

					(results.connections as IDataObject).epic = {
						status: 'connected',
						latency: connectionTestOptions.includeLatency ? `${latency}ms` : undefined,
					};
				} catch (error) {
					(results.connections as IDataObject).epic = {
						status: 'error',
						error: (error as Error).message,
					};
				}
			}

			return results;
		}

		case 'getApiStatus': {
			const statusOptions = this.getNodeParameter('statusOptions', index, {}) as IDataObject;

			const credentials = await this.getCredentials('r1RcmApi');
			const { R1RcmClient } = await import('../../transport/r1RcmClient');
			const client = new R1RcmClient(credentials);

			const params: IDataObject = {};
			if (statusOptions.includeAllEndpoints) params.includeEndpoints = true;
			if (statusOptions.includeRateLimits) params.includeRateLimits = true;
			if (statusOptions.includeVersionInfo) params.includeVersion = true;

			const response = await client.request('GET', '/status', undefined, params);

			return {
				success: true,
				operation: 'getApiStatus',
				status: response,
				checkedAt: new Date().toISOString(),
			};
		}

		default:
			throw new Error(`Unknown utility operation: ${operation}`);
	}
}

/**
 * Validate NPI using Luhn algorithm
 * NPI uses the Luhn algorithm with a prefix of 80840
 */
function validateNpiLuhn(npi: string): boolean {
	// Prepend 80840 to 10-digit NPI for Luhn validation
	const prefixedNpi = '80840' + npi;
	
	let sum = 0;
	let alternate = false;
	
	for (let i = prefixedNpi.length - 1; i >= 0; i--) {
		let digit = parseInt(prefixedNpi[i], 10);
		
		if (alternate) {
			digit *= 2;
			if (digit > 9) {
				digit = (digit % 10) + 1;
			}
		}
		
		sum += digit;
		alternate = !alternate;
	}
	
	return sum % 10 === 0;
}

/**
 * Format Tax ID with proper separators
 */
function formatTaxId(taxId: string, type: string): string {
	if (type === 'EIN' && taxId.length === 9) {
		return `${taxId.substring(0, 2)}-${taxId.substring(2)}`;
	} else if (type === 'SSN' && taxId.length === 9) {
		return `${taxId.substring(0, 3)}-${taxId.substring(3, 5)}-${taxId.substring(5)}`;
	}
	return taxId;
}

/**
 * Get appeal strategy for CARC code
 */
function getAppealStrategy(code: string): IDataObject {
	const strategies: Record<string, IDataObject> = {
		'1': {
			strategy: 'Verify deductible amount and patient responsibility',
			actions: ['Review EOB', 'Verify benefits', 'Bill patient or secondary'],
		},
		'2': {
			strategy: 'Verify coinsurance calculation',
			actions: ['Review contract', 'Recalculate expected payment', 'Appeal if incorrect'],
		},
		'3': {
			strategy: 'Verify copay amount',
			actions: ['Check fee schedule', 'Verify visit type', 'Collect from patient'],
		},
		'4': {
			strategy: 'Review modifier usage and medical necessity',
			actions: ['Review documentation', 'Add supporting documentation', 'Appeal with clinical notes'],
		},
		'16': {
			strategy: 'Review claim information for accuracy',
			actions: ['Verify all fields', 'Correct and resubmit', 'Include all required attachments'],
		},
		'18': {
			strategy: 'Exact duplicate - review claim history',
			actions: ['Verify original claim status', 'Request payment status', 'Do not resubmit if paid'],
		},
		'29': {
			strategy: 'Timely filing limit exceeded',
			actions: ['Review filing deadlines', 'Document proof of timely filing', 'Appeal with evidence'],
		},
		'50': {
			strategy: 'Medical necessity - obtain clinical documentation',
			actions: ['Get physician attestation', 'Include clinical notes', 'Appeal with supporting literature'],
		},
		'96': {
			strategy: 'Non-covered charge - review coverage',
			actions: ['Verify plan benefits', 'Check for policy exclusions', 'Bill patient if appropriate'],
		},
		'97': {
			strategy: 'Payment included in another service',
			actions: ['Review bundling rules', 'Add appropriate modifier', 'Appeal if incorrectly bundled'],
		},
	};
	
	return strategies[code] || {
		strategy: 'Review denial reason and supporting documentation',
		actions: ['Review EOB', 'Gather documentation', 'Submit appeal if appropriate'],
	};
}

/**
 * Get Place of Service codes
 */
function getPlaceOfServiceCodes(): IDataObject[] {
	return [
		{ code: '01', name: 'Pharmacy', facilityType: 'non_facility' },
		{ code: '02', name: 'Telehealth', facilityType: 'non_facility' },
		{ code: '03', name: 'School', facilityType: 'non_facility' },
		{ code: '04', name: 'Homeless Shelter', facilityType: 'non_facility' },
		{ code: '05', name: 'Indian Health Service Free-standing', facilityType: 'facility' },
		{ code: '06', name: 'Indian Health Service Provider-based', facilityType: 'facility' },
		{ code: '07', name: 'Tribal 638 Free-standing', facilityType: 'facility' },
		{ code: '08', name: 'Tribal 638 Provider-based', facilityType: 'facility' },
		{ code: '09', name: 'Prison/Correctional Facility', facilityType: 'facility' },
		{ code: '10', name: 'Telehealth in Patient Home', facilityType: 'non_facility' },
		{ code: '11', name: 'Office', facilityType: 'non_facility' },
		{ code: '12', name: 'Home', facilityType: 'non_facility' },
		{ code: '13', name: 'Assisted Living Facility', facilityType: 'non_facility' },
		{ code: '14', name: 'Group Home', facilityType: 'non_facility' },
		{ code: '15', name: 'Mobile Unit', facilityType: 'non_facility' },
		{ code: '16', name: 'Temporary Lodging', facilityType: 'non_facility' },
		{ code: '17', name: 'Walk-in Retail Health Clinic', facilityType: 'non_facility' },
		{ code: '18', name: 'Place of Employment/Worksite', facilityType: 'non_facility' },
		{ code: '19', name: 'Off Campus-Outpatient Hospital', facilityType: 'facility' },
		{ code: '20', name: 'Urgent Care Facility', facilityType: 'non_facility' },
		{ code: '21', name: 'Inpatient Hospital', facilityType: 'facility' },
		{ code: '22', name: 'On Campus-Outpatient Hospital', facilityType: 'facility' },
		{ code: '23', name: 'Emergency Room - Hospital', facilityType: 'facility' },
		{ code: '24', name: 'Ambulatory Surgical Center', facilityType: 'facility' },
		{ code: '25', name: 'Birthing Center', facilityType: 'facility' },
		{ code: '26', name: 'Military Treatment Facility', facilityType: 'facility' },
		{ code: '31', name: 'Skilled Nursing Facility', facilityType: 'facility' },
		{ code: '32', name: 'Nursing Facility', facilityType: 'facility' },
		{ code: '33', name: 'Custodial Care Facility', facilityType: 'facility' },
		{ code: '34', name: 'Hospice', facilityType: 'facility' },
		{ code: '41', name: 'Ambulance - Land', facilityType: 'non_facility' },
		{ code: '42', name: 'Ambulance - Air or Water', facilityType: 'non_facility' },
		{ code: '49', name: 'Independent Clinic', facilityType: 'non_facility' },
		{ code: '50', name: 'Federally Qualified Health Center', facilityType: 'non_facility' },
		{ code: '51', name: 'Inpatient Psychiatric Facility', facilityType: 'facility' },
		{ code: '52', name: 'Psychiatric Facility Partial Hospitalization', facilityType: 'facility' },
		{ code: '53', name: 'Community Mental Health Center', facilityType: 'non_facility' },
		{ code: '54', name: 'Intermediate Care Facility/MR', facilityType: 'facility' },
		{ code: '55', name: 'Residential Substance Abuse Facility', facilityType: 'facility' },
		{ code: '56', name: 'Psychiatric Residential Treatment Center', facilityType: 'facility' },
		{ code: '57', name: 'Non-residential Substance Abuse Facility', facilityType: 'non_facility' },
		{ code: '58', name: 'Non-residential Opioid Treatment Facility', facilityType: 'non_facility' },
		{ code: '60', name: 'Mass Immunization Center', facilityType: 'non_facility' },
		{ code: '61', name: 'Comprehensive Inpatient Rehabilitation', facilityType: 'facility' },
		{ code: '62', name: 'Comprehensive Outpatient Rehabilitation', facilityType: 'non_facility' },
		{ code: '65', name: 'End Stage Renal Disease Facility', facilityType: 'non_facility' },
		{ code: '71', name: 'State or Local Public Health Clinic', facilityType: 'non_facility' },
		{ code: '72', name: 'Rural Health Clinic', facilityType: 'non_facility' },
		{ code: '81', name: 'Independent Laboratory', facilityType: 'non_facility' },
		{ code: '99', name: 'Other Place of Service', facilityType: 'non_facility' },
	];
}
