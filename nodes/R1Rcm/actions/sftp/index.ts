/* Copyright (c) Velocity BPA, LLC. Licensed under the Business Source License 1.1. See LICENSE file for details. Commercial use requires a separate license from Velocity BPA. */

import type { INodeProperties, IExecuteFunctions, IDataObject } from 'n8n-workflow';

/**
 * SFTP Resource Operations
 * 
 * Healthcare organizations use SFTP for secure file transfers including:
 * - 837 claim files (professional, institutional, dental)
 * - 835 remittance files
 * - 270/271 eligibility files
 * - 276/277 claim status files
 * - Patient data files
 * - Report exports
 * 
 * HIPAA requires encryption in transit for PHI, making SFTP essential
 * for healthcare data exchange with clearinghouses and payers.
 */

export const sftpOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sftp'],
			},
		},
		options: [
			{
				name: 'Upload File',
				value: 'uploadFile',
				description: 'Upload a file to the SFTP server',
				action: 'Upload file to SFTP',
			},
			{
				name: 'Download File',
				value: 'downloadFile',
				description: 'Download a file from the SFTP server',
				action: 'Download file from SFTP',
			},
			{
				name: 'List Files',
				value: 'listFiles',
				description: 'List files in an SFTP directory',
				action: 'List files in SFTP directory',
			},
			{
				name: 'Get File Status',
				value: 'getFileStatus',
				description: 'Get status and metadata of a file',
				action: 'Get file status from SFTP',
			},
			{
				name: 'Delete File',
				value: 'deleteFile',
				description: 'Delete a file from the SFTP server',
				action: 'Delete file from SFTP',
			},
		],
		default: 'listFiles',
	},
];

export const sftpFields: INodeProperties[] = [
	// Upload File fields
	{
		displayName: 'Remote Path',
		name: 'remotePath',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['uploadFile'],
			},
		},
		default: '',
		placeholder: '/outbound/claims/837P_20240115.txt',
		description: 'Full path including filename where the file will be uploaded',
	},
	{
		displayName: 'File Content',
		name: 'fileContent',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['uploadFile'],
			},
		},
		default: '',
		description: 'Content to upload (for text files) or base64-encoded content (for binary files)',
	},
	{
		displayName: 'File Type',
		name: 'fileType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['uploadFile'],
			},
		},
		options: [
			{
				name: '837P - Professional Claims',
				value: '837P',
				description: 'Professional claim submission file',
			},
			{
				name: '837I - Institutional Claims',
				value: '837I',
				description: 'Institutional/hospital claim submission file',
			},
			{
				name: '837D - Dental Claims',
				value: '837D',
				description: 'Dental claim submission file',
			},
			{
				name: '270 - Eligibility Inquiry',
				value: '270',
				description: 'Eligibility verification request',
			},
			{
				name: '276 - Claim Status Inquiry',
				value: '276',
				description: 'Claim status request',
			},
			{
				name: '278 - Authorization Request',
				value: '278',
				description: 'Prior authorization request',
			},
			{
				name: 'Patient Data',
				value: 'patient_data',
				description: 'Patient demographic or clinical data',
			},
			{
				name: 'Report',
				value: 'report',
				description: 'Analytics or operational report',
			},
			{
				name: 'Other',
				value: 'other',
				description: 'Other file type',
			},
		],
		default: '837P',
		description: 'Type of healthcare file being uploaded',
	},
	{
		displayName: 'Upload Options',
		name: 'uploadOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['uploadFile'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Binary Upload',
				name: 'binaryUpload',
				type: 'boolean',
				default: false,
				description: 'Whether the file content is base64-encoded binary',
			},
			{
				displayName: 'Overwrite Existing',
				name: 'overwriteExisting',
				type: 'boolean',
				default: false,
				description: 'Whether to overwrite the file if it already exists',
			},
			{
				displayName: 'Create Directory',
				name: 'createDirectory',
				type: 'boolean',
				default: true,
				description: 'Whether to create parent directories if they do not exist',
			},
			{
				displayName: 'Permissions',
				name: 'permissions',
				type: 'string',
				default: '0644',
				description: 'File permissions in octal format (e.g., 0644)',
			},
			{
				displayName: 'Add Timestamp',
				name: 'addTimestamp',
				type: 'boolean',
				default: false,
				description: 'Whether to append a timestamp to the filename',
			},
			{
				displayName: 'Sender ID',
				name: 'senderId',
				type: 'string',
				default: '',
				description: 'Submitter ID for EDI files (used in ISA segment)',
			},
			{
				displayName: 'Receiver ID',
				name: 'receiverId',
				type: 'string',
				default: '',
				description: 'Receiver ID for EDI files (used in ISA segment)',
			},
		],
	},

	// Download File fields
	{
		displayName: 'Remote Path',
		name: 'remotePath',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['downloadFile'],
			},
		},
		default: '',
		placeholder: '/inbound/remittance/835_20240115.txt',
		description: 'Full path to the file to download',
	},
	{
		displayName: 'Download Options',
		name: 'downloadOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['downloadFile'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Return Binary',
				name: 'returnBinary',
				type: 'boolean',
				default: false,
				description: 'Whether to return the file as base64-encoded binary',
			},
			{
				displayName: 'Parse EDI',
				name: 'parseEdi',
				type: 'boolean',
				default: false,
				description: 'Whether to parse EDI content and return structured data',
			},
			{
				displayName: 'Delete After Download',
				name: 'deleteAfterDownload',
				type: 'boolean',
				default: false,
				description: 'Whether to delete the file after successful download',
			},
			{
				displayName: 'Move After Download',
				name: 'moveAfterDownload',
				type: 'boolean',
				default: false,
				description: 'Whether to move the file to an archive directory after download',
			},
			{
				displayName: 'Archive Directory',
				name: 'archiveDirectory',
				type: 'string',
				default: '/archive',
				description: 'Directory to move files to after download',
			},
		],
	},

	// List Files fields
	{
		displayName: 'Directory Path',
		name: 'directoryPath',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['listFiles'],
			},
		},
		default: '/',
		placeholder: '/inbound/remittance',
		description: 'Directory path to list files from',
	},
	{
		displayName: 'File Type Filter',
		name: 'fileTypeFilter',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['listFiles'],
			},
		},
		options: [
			{
				name: 'All Files',
				value: 'all',
				description: 'Show all files',
			},
			{
				name: '835 - Remittance',
				value: '835',
				description: 'Remittance advice files',
			},
			{
				name: '837 - Claims',
				value: '837',
				description: 'Claim submission files',
			},
			{
				name: '271 - Eligibility Response',
				value: '271',
				description: 'Eligibility response files',
			},
			{
				name: '277 - Claim Status Response',
				value: '277',
				description: 'Claim status response files',
			},
			{
				name: '278 - Auth Response',
				value: '278_response',
				description: 'Prior authorization response files',
			},
			{
				name: '999 - Acknowledgment',
				value: '999',
				description: 'Functional acknowledgment files',
			},
			{
				name: 'Reports',
				value: 'reports',
				description: 'Report files',
			},
		],
		default: 'all',
		description: 'Filter files by healthcare transaction type',
	},
	{
		displayName: 'List Options',
		name: 'listOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['listFiles'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Pattern',
				name: 'pattern',
				type: 'string',
				default: '*',
				description: 'Glob pattern to filter files (e.g., *.835, 837P_*)',
			},
			{
				displayName: 'Include Subdirectories',
				name: 'includeSubdirectories',
				type: 'boolean',
				default: false,
				description: 'Whether to include files from subdirectories',
			},
			{
				displayName: 'Modified After',
				name: 'modifiedAfter',
				type: 'dateTime',
				default: '',
				description: 'Only show files modified after this date',
			},
			{
				displayName: 'Modified Before',
				name: 'modifiedBefore',
				type: 'dateTime',
				default: '',
				description: 'Only show files modified before this date',
			},
			{
				displayName: 'Min Size (bytes)',
				name: 'minSize',
				type: 'number',
				default: 0,
				description: 'Minimum file size in bytes',
			},
			{
				displayName: 'Max Size (bytes)',
				name: 'maxSize',
				type: 'number',
				default: 0,
				description: 'Maximum file size in bytes (0 = no limit)',
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{ name: 'Name', value: 'name' },
					{ name: 'Date Modified', value: 'modified' },
					{ name: 'Size', value: 'size' },
				],
				default: 'modified',
				description: 'Field to sort results by',
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 'asc' },
					{ name: 'Descending', value: 'desc' },
				],
				default: 'desc',
				description: 'Sort order for results',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Maximum number of files to return',
			},
		],
	},

	// Get File Status fields
	{
		displayName: 'Remote Path',
		name: 'remotePath',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['getFileStatus'],
			},
		},
		default: '',
		placeholder: '/inbound/835_20240115.txt',
		description: 'Full path to the file to check',
	},
	{
		displayName: 'Status Options',
		name: 'statusOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['getFileStatus'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Include Checksum',
				name: 'includeChecksum',
				type: 'boolean',
				default: false,
				description: 'Whether to calculate and include file checksum (MD5)',
			},
			{
				displayName: 'Validate EDI',
				name: 'validateEdi',
				type: 'boolean',
				default: false,
				description: 'Whether to perform basic EDI validation on the file',
			},
			{
				displayName: 'Preview Content',
				name: 'previewContent',
				type: 'boolean',
				default: false,
				description: 'Whether to include a preview of file content',
			},
			{
				displayName: 'Preview Lines',
				name: 'previewLines',
				type: 'number',
				default: 10,
				description: 'Number of lines to include in preview',
			},
		],
	},

	// Delete File fields
	{
		displayName: 'Remote Path',
		name: 'remotePath',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['deleteFile'],
			},
		},
		default: '',
		placeholder: '/processed/835_20240115.txt',
		description: 'Full path to the file to delete',
	},
	{
		displayName: 'Delete Options',
		name: 'deleteOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['sftp'],
				operation: ['deleteFile'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Fail If Not Exists',
				name: 'failIfNotExists',
				type: 'boolean',
				default: true,
				description: 'Whether to fail if the file does not exist',
			},
			{
				displayName: 'Archive Before Delete',
				name: 'archiveBeforeDelete',
				type: 'boolean',
				default: false,
				description: 'Whether to archive the file before deleting',
			},
			{
				displayName: 'Archive Directory',
				name: 'archiveDirectory',
				type: 'string',
				default: '/archive',
				description: 'Directory to archive files to before deletion',
			},
			{
				displayName: 'Delete Directory',
				name: 'deleteDirectory',
				type: 'boolean',
				default: false,
				description: 'Whether path refers to a directory to delete (must be empty)',
			},
		],
	},
];

/**
 * Execute SFTP operations
 */
export async function executeSftpOperation(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('r1RcmSftp');
	
	// Import SFTP client
	const { SftpClient } = await import('../../transport/sftpClient');
	const sftpClient = new SftpClient(credentials);

	try {
		await sftpClient.connect();

		switch (operation) {
			case 'uploadFile': {
				const remotePath = this.getNodeParameter('remotePath', index) as string;
				const fileContent = this.getNodeParameter('fileContent', index) as string;
				const fileType = this.getNodeParameter('fileType', index) as string;
				const uploadOptions = this.getNodeParameter('uploadOptions', index, {}) as IDataObject;

				let content: Buffer;
				if (uploadOptions.binaryUpload) {
					content = Buffer.from(fileContent, 'base64');
				} else {
					content = Buffer.from(fileContent, 'utf-8');
				}

				// Add timestamp to filename if requested
				let finalPath = remotePath;
				if (uploadOptions.addTimestamp) {
					const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
					const lastDot = remotePath.lastIndexOf('.');
					if (lastDot > 0) {
						finalPath = `${remotePath.substring(0, lastDot)}_${timestamp}${remotePath.substring(lastDot)}`;
					} else {
						finalPath = `${remotePath}_${timestamp}`;
					}
				}

				// Create directory if needed
				if (uploadOptions.createDirectory) {
					const dirPath = finalPath.substring(0, finalPath.lastIndexOf('/'));
					if (dirPath) {
						await sftpClient.ensureDirectory(dirPath);
					}
				}

				await sftpClient.uploadFile(finalPath, content, {
					overwrite: uploadOptions.overwriteExisting as boolean,
					permissions: uploadOptions.permissions as string,
				});

				return {
					success: true,
					operation: 'uploadFile',
					remotePath: finalPath,
					fileType,
					size: content.length,
					uploadedAt: new Date().toISOString(),
					metadata: {
						senderId: uploadOptions.senderId || null,
						receiverId: uploadOptions.receiverId || null,
					},
				};
			}

			case 'downloadFile': {
				const remotePath = this.getNodeParameter('remotePath', index) as string;
				const downloadOptions = this.getNodeParameter('downloadOptions', index, {}) as IDataObject;

				const content = await sftpClient.downloadFile(remotePath);

				// Handle post-download actions
				if (downloadOptions.deleteAfterDownload) {
					await sftpClient.deleteFile(remotePath);
				} else if (downloadOptions.moveAfterDownload && downloadOptions.archiveDirectory) {
					const fileName = remotePath.substring(remotePath.lastIndexOf('/') + 1);
					const archivePath = `${downloadOptions.archiveDirectory}/${fileName}`;
					await sftpClient.moveFile(remotePath, archivePath);
				}

				let fileContent: string;
				let parsedContent: IDataObject | null = null;

				if (downloadOptions.returnBinary) {
					fileContent = content.toString('base64');
				} else {
					fileContent = content.toString('utf-8');

					// Parse EDI if requested
					if (downloadOptions.parseEdi) {
						parsedContent = parseEdiContent(fileContent);
					}
				}

				return {
					success: true,
					operation: 'downloadFile',
					remotePath,
					content: fileContent,
					parsedContent,
					size: content.length,
					downloadedAt: new Date().toISOString(),
					postAction: downloadOptions.deleteAfterDownload
						? 'deleted'
						: downloadOptions.moveAfterDownload
						? 'archived'
						: 'none',
				};
			}

			case 'listFiles': {
				const directoryPath = this.getNodeParameter('directoryPath', index) as string;
				const fileTypeFilter = this.getNodeParameter('fileTypeFilter', index) as string;
				const listOptions = this.getNodeParameter('listOptions', index, {}) as IDataObject;

				let files = await sftpClient.listFiles(directoryPath, {
					pattern: listOptions.pattern as string,
					recursive: listOptions.includeSubdirectories as boolean,
				});

				// Apply file type filter
				if (fileTypeFilter !== 'all') {
					files = files.filter((file: IDataObject) => {
						const name = (file.name as string).toUpperCase();
						switch (fileTypeFilter) {
							case '835': return name.includes('835');
							case '837': return name.includes('837');
							case '271': return name.includes('271');
							case '277': return name.includes('277');
							case '278_response': return name.includes('278') && !name.includes('REQUEST');
							case '999': return name.includes('999') || name.includes('ACK');
							case 'reports': return name.includes('REPORT') || name.includes('RPT');
							default: return true;
						}
					});
				}

				// Apply date filters
				if (listOptions.modifiedAfter) {
					const afterDate = new Date(listOptions.modifiedAfter as string);
					files = files.filter((file: IDataObject) =>
						new Date(file.modifiedAt as string) > afterDate
					);
				}
				if (listOptions.modifiedBefore) {
					const beforeDate = new Date(listOptions.modifiedBefore as string);
					files = files.filter((file: IDataObject) =>
						new Date(file.modifiedAt as string) < beforeDate
					);
				}

				// Apply size filters
				if (listOptions.minSize && (listOptions.minSize as number) > 0) {
					files = files.filter((file: IDataObject) =>
						(file.size as number) >= (listOptions.minSize as number)
					);
				}
				if (listOptions.maxSize && (listOptions.maxSize as number) > 0) {
					files = files.filter((file: IDataObject) =>
						(file.size as number) <= (listOptions.maxSize as number)
					);
				}

				// Sort files
				const sortBy = listOptions.sortBy as string || 'modified';
				const sortOrder = listOptions.sortOrder as string || 'desc';
				files.sort((a: IDataObject, b: IDataObject) => {
					let comparison = 0;
					switch (sortBy) {
						case 'name':
							comparison = (a.name as string).localeCompare(b.name as string);
							break;
						case 'size':
							comparison = (a.size as number) - (b.size as number);
							break;
						case 'modified':
						default:
							comparison = new Date(a.modifiedAt as string).getTime() -
								new Date(b.modifiedAt as string).getTime();
					}
					return sortOrder === 'desc' ? -comparison : comparison;
				});

				// Apply limit
				const limit = listOptions.limit as number || 100;
				files = files.slice(0, limit);

				return {
					success: true,
					operation: 'listFiles',
					directoryPath,
					fileTypeFilter,
					totalFiles: files.length,
					files,
					listedAt: new Date().toISOString(),
				};
			}

			case 'getFileStatus': {
				const remotePath = this.getNodeParameter('remotePath', index) as string;
				const statusOptions = this.getNodeParameter('statusOptions', index, {}) as IDataObject;

				const stats = await sftpClient.getFileStats(remotePath);

				const result: IDataObject = {
					success: true,
					operation: 'getFileStatus',
					remotePath,
					exists: true,
					...stats,
				};

				// Include checksum if requested
				if (statusOptions.includeChecksum) {
					const content = await sftpClient.downloadFile(remotePath);
					const crypto = await import('crypto');
					result.checksum = {
						md5: crypto.createHash('md5').update(content).digest('hex'),
					};
				}

				// Preview content if requested
				if (statusOptions.previewContent) {
					const content = await sftpClient.downloadFile(remotePath);
					const lines = content.toString('utf-8').split('\n');
					const previewLines = statusOptions.previewLines as number || 10;
					result.preview = lines.slice(0, previewLines).join('\n');
					result.totalLines = lines.length;
				}

				// Validate EDI if requested
				if (statusOptions.validateEdi) {
					const content = await sftpClient.downloadFile(remotePath);
					result.ediValidation = validateEdiFile(content.toString('utf-8'));
				}

				return result;
			}

			case 'deleteFile': {
				const remotePath = this.getNodeParameter('remotePath', index) as string;
				const deleteOptions = this.getNodeParameter('deleteOptions', index, {}) as IDataObject;

				// Archive before delete if requested
				if (deleteOptions.archiveBeforeDelete && deleteOptions.archiveDirectory) {
					const fileName = remotePath.substring(remotePath.lastIndexOf('/') + 1);
					const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
					const archivePath = `${deleteOptions.archiveDirectory}/${timestamp}_${fileName}`;
					await sftpClient.copyFile(remotePath, archivePath);
				}

				if (deleteOptions.deleteDirectory) {
					await sftpClient.deleteDirectory(remotePath);
				} else {
					await sftpClient.deleteFile(remotePath, {
						failIfNotExists: deleteOptions.failIfNotExists as boolean,
					});
				}

				return {
					success: true,
					operation: 'deleteFile',
					remotePath,
					deletedAt: new Date().toISOString(),
					archived: deleteOptions.archiveBeforeDelete || false,
				};
			}

			default:
				throw new Error(`Unknown SFTP operation: ${operation}`);
		}
	} finally {
		await sftpClient.disconnect();
	}
}

/**
 * Parse EDI content into structured data
 */
function parseEdiContent(content: string): IDataObject {
	const segments = content.split('~').map(s => s.trim()).filter(s => s.length > 0);
	const result: IDataObject = {
		segmentCount: segments.length,
		transactionType: null,
		interchangeControlNumber: null,
		senderId: null,
		receiverId: null,
		createdDate: null,
	};

	for (const segment of segments) {
		const elements = segment.split('*');
		const segmentId = elements[0];

		switch (segmentId) {
			case 'ISA':
				result.senderId = elements[6]?.trim();
				result.receiverId = elements[8]?.trim();
				result.interchangeControlNumber = elements[13]?.trim();
				result.createdDate = `20${elements[9]}`;
				break;
			case 'ST':
				result.transactionType = getTransactionTypeName(elements[1]);
				break;
		}
	}

	return result;
}

/**
 * Get transaction type name from code
 */
function getTransactionTypeName(code: string): string {
	const types: Record<string, string> = {
		'270': 'Eligibility Inquiry',
		'271': 'Eligibility Response',
		'276': 'Claim Status Inquiry',
		'277': 'Claim Status Response',
		'278': 'Prior Authorization',
		'835': 'Remittance Advice',
		'837': 'Healthcare Claim',
		'999': 'Functional Acknowledgment',
	};
	return types[code] || code;
}

/**
 * Validate EDI file structure
 */
function validateEdiFile(content: string): IDataObject {
	const errors: string[] = [];
	const warnings: string[] = [];
	const segments = content.split('~').map(s => s.trim()).filter(s => s.length > 0);

	// Check for required segments
	const segmentIds = segments.map(s => s.split('*')[0]);
	
	if (!segmentIds.includes('ISA')) {
		errors.push('Missing ISA (Interchange Control Header) segment');
	}
	if (!segmentIds.includes('IEA')) {
		errors.push('Missing IEA (Interchange Control Trailer) segment');
	}
	if (!segmentIds.includes('GS')) {
		errors.push('Missing GS (Functional Group Header) segment');
	}
	if (!segmentIds.includes('GE')) {
		errors.push('Missing GE (Functional Group Trailer) segment');
	}
	if (!segmentIds.includes('ST')) {
		errors.push('Missing ST (Transaction Set Header) segment');
	}
	if (!segmentIds.includes('SE')) {
		errors.push('Missing SE (Transaction Set Trailer) segment');
	}

	// Check segment counts
	const stCount = segmentIds.filter(id => id === 'ST').length;
	const seCount = segmentIds.filter(id => id === 'SE').length;
	if (stCount !== seCount) {
		errors.push(`ST/SE count mismatch: ${stCount} ST segments, ${seCount} SE segments`);
	}

	// Check for valid delimiters
	if (content.length > 0 && !content.includes('~')) {
		warnings.push('No segment terminators (~) found - may not be valid X12 EDI');
	}

	return {
		valid: errors.length === 0,
		errorCount: errors.length,
		warningCount: warnings.length,
		errors,
		warnings,
		segmentCount: segments.length,
		transactionSetCount: stCount,
	};
}
