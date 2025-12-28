/* Copyright (c) Velocity BPA, LLC. Licensed under the Business Source License 1.1. See LICENSE file for details. Commercial use requires a separate license from Velocity BPA. */

/**
 * Integration Tests for R1 RCM Node Operations
 * 
 * These tests validate the node operations against the R1 RCM API.
 * Requires valid API credentials in environment variables.
 * 
 * Environment Variables:
 * - R1RCM_CLIENT_ID
 * - R1RCM_CLIENT_SECRET
 * - R1RCM_API_KEY
 * - R1RCM_ORG_ID
 * - R1RCM_FACILITY_ID
 * - R1RCM_ENVIRONMENT (test/production)
 */

// Skip integration tests if credentials not available
const hasCredentials = process.env.R1RCM_CLIENT_ID && process.env.R1RCM_CLIENT_SECRET;
const describeIfCredentials = hasCredentials ? describe : describe.skip;

// Mock n8n-workflow for testing
jest.mock('n8n-workflow', () => ({
	NodeApiError: class extends Error {
		constructor(node: any, error: any) {
			super(error.message);
		}
	},
}));

describeIfCredentials('R1 RCM API Integration Tests', () => {
	// Test credentials from environment
	const testCredentials = {
		environment: process.env.R1RCM_ENVIRONMENT || 'test',
		clientId: process.env.R1RCM_CLIENT_ID || '',
		clientSecret: process.env.R1RCM_CLIENT_SECRET || '',
		apiKey: process.env.R1RCM_API_KEY || '',
		organizationId: process.env.R1RCM_ORG_ID || '',
		facilityId: process.env.R1RCM_FACILITY_ID || '',
	};

	let client: any;

	beforeAll(async () => {
		// Initialize client
		const { R1RcmClient } = await import('../../nodes/R1Rcm/transport/r1RcmClient');
		client = new R1RcmClient(testCredentials);
	});

	describe('Connection Test', () => {
		test('should connect to API successfully', async () => {
			const response = await client.request('GET', '/health');
			expect(response).toBeDefined();
			expect(response.status).toBe('healthy');
		});
	});

	describe('Patient Access Operations', () => {
		let testPatientId: string;

		test('should search for patients', async () => {
			const response = await client.request('GET', '/patients', undefined, {
				lastName: 'Smith',
				limit: 10,
			});
			
			expect(response).toBeDefined();
			expect(Array.isArray(response.patients || response)).toBe(true);
			
			// Store patient ID for subsequent tests
			if (response.patients?.length > 0) {
				testPatientId = response.patients[0].patientId;
			}
		});

		test('should get patient details', async () => {
			if (!testPatientId) {
				console.log('Skipping - no test patient available');
				return;
			}

			const response = await client.request('GET', `/patients/${testPatientId}`);
			
			expect(response).toBeDefined();
			expect(response.patientId).toBe(testPatientId);
		});
	});

	describe('Eligibility Operations', () => {
		test('should check eligibility (270/271)', async () => {
			const eligibilityRequest = {
				patientId: 'TEST-PATIENT-001',
				payerId: 'TEST-PAYER-001',
				serviceType: 'professional',
				dateOfService: new Date().toISOString().split('T')[0],
			};

			const response = await client.request('POST', '/eligibility/check', eligibilityRequest);
			
			expect(response).toBeDefined();
			expect(response.transactionId).toBeDefined();
		});
	});

	describe('Claim Operations', () => {
		test('should get claim status (276/277)', async () => {
			const statusRequest = {
				claimId: 'TEST-CLAIM-001',
			};

			try {
				const response = await client.request('GET', `/claims/${statusRequest.claimId}/status`);
				
				expect(response).toBeDefined();
				expect(response.claimStatus).toBeDefined();
			} catch (error) {
				// Claim may not exist in test environment
				console.log('Claim not found - expected in test environment');
			}
		});

		test('should list claims with filters', async () => {
			const response = await client.request('GET', '/claims', undefined, {
				status: 'submitted',
				limit: 10,
			});
			
			expect(response).toBeDefined();
			expect(Array.isArray(response.claims || response)).toBe(true);
		});
	});

	describe('Work Queue Operations', () => {
		test('should list work queues', async () => {
			const response = await client.request('GET', '/workqueues');
			
			expect(response).toBeDefined();
			expect(Array.isArray(response.queues || response)).toBe(true);
		});

		test('should get queue metrics', async () => {
			const response = await client.request('GET', '/workqueues/metrics');
			
			expect(response).toBeDefined();
		});
	});

	describe('Analytics Operations', () => {
		test('should get revenue dashboard', async () => {
			const response = await client.request('GET', '/analytics/revenue/dashboard', undefined, {
				period: 'month',
			});
			
			expect(response).toBeDefined();
		});

		test('should get KPI metrics', async () => {
			const response = await client.request('GET', '/analytics/kpis', undefined, {
				metrics: ['daysInAR', 'cleanClaimRate', 'denialRate'],
			});
			
			expect(response).toBeDefined();
		});
	});

	describe('Webhook Operations', () => {
		let testWebhookId: string;

		test('should list webhooks', async () => {
			const response = await client.request('GET', '/webhooks');
			
			expect(response).toBeDefined();
			expect(Array.isArray(response.webhooks || response)).toBe(true);
		});

		test('should create a webhook', async () => {
			const webhookConfig = {
				name: 'Integration Test Webhook',
				url: 'https://test.example.com/webhook',
				events: ['claim.submitted'],
				enabled: false, // Disabled for testing
			};

			const response = await client.request('POST', '/webhooks', webhookConfig);
			
			expect(response).toBeDefined();
			expect(response.id).toBeDefined();
			testWebhookId = response.id;
		});

		test('should delete webhook', async () => {
			if (!testWebhookId) {
				console.log('Skipping - no test webhook created');
				return;
			}

			await client.request('DELETE', `/webhooks/${testWebhookId}`);
			
			// Verify deletion
			try {
				await client.request('GET', `/webhooks/${testWebhookId}`);
				fail('Webhook should have been deleted');
			} catch (error) {
				// Expected - webhook not found
				expect((error as Error).message).toContain('404');
			}
		});
	});

	describe('Utility Operations', () => {
		test('should validate NPI against NPPES', async () => {
			// This is a real NPI from the NPPES registry (publicly available)
			const response = await client.request('GET', '/utilities/npi/1234567893/validate', undefined, {
				checkNppesRegistry: true,
			});
			
			expect(response).toBeDefined();
			expect(response.valid).toBeDefined();
		});

		test('should get API status', async () => {
			const response = await client.request('GET', '/status');
			
			expect(response).toBeDefined();
			expect(response.status).toBe('operational');
		});
	});
});

describe('Error Handling', () => {
	test('should handle authentication errors', async () => {
		const invalidCredentials = {
			environment: 'test',
			clientId: 'invalid',
			clientSecret: 'invalid',
			apiKey: 'invalid',
			organizationId: 'test',
			facilityId: 'test',
		};

		const { R1RcmClient } = await import('../../nodes/R1Rcm/transport/r1RcmClient');
		const client = new R1RcmClient(invalidCredentials);

		await expect(client.request('GET', '/health')).rejects.toThrow();
	});

	test('should handle rate limiting', async () => {
		// Rate limiting behavior test - may not trigger in all environments
		if (!hasCredentials) {
			console.log('Skipping - credentials not available');
			return;
		}

		const { R1RcmClient } = await import('../../nodes/R1Rcm/transport/r1RcmClient');
		const client = new R1RcmClient({
			environment: process.env.R1RCM_ENVIRONMENT || 'test',
			clientId: process.env.R1RCM_CLIENT_ID || '',
			clientSecret: process.env.R1RCM_CLIENT_SECRET || '',
			apiKey: process.env.R1RCM_API_KEY || '',
			organizationId: process.env.R1RCM_ORG_ID || '',
			facilityId: process.env.R1RCM_FACILITY_ID || '',
		});

		// Make multiple rapid requests
		const promises = [];
		for (let i = 0; i < 10; i++) {
			promises.push(client.request('GET', '/health'));
		}

		// Should handle rate limiting gracefully
		const results = await Promise.allSettled(promises);
		const successful = results.filter(r => r.status === 'fulfilled').length;
		expect(successful).toBeGreaterThan(0);
	});
});

describe('Pagination', () => {
	test('should handle paginated results', async () => {
		if (!hasCredentials) {
			console.log('Skipping - credentials not available');
			return;
		}

		const { R1RcmClient } = await import('../../nodes/R1Rcm/transport/r1RcmClient');
		const client = new R1RcmClient({
			environment: process.env.R1RCM_ENVIRONMENT || 'test',
			clientId: process.env.R1RCM_CLIENT_ID || '',
			clientSecret: process.env.R1RCM_CLIENT_SECRET || '',
			apiKey: process.env.R1RCM_API_KEY || '',
			organizationId: process.env.R1RCM_ORG_ID || '',
			facilityId: process.env.R1RCM_FACILITY_ID || '',
		});

		// Request paginated data
		const page1 = await client.request('GET', '/claims', undefined, {
			limit: 10,
			offset: 0,
		});

		expect(page1).toBeDefined();
		
		if (page1.total > 10) {
			const page2 = await client.request('GET', '/claims', undefined, {
				limit: 10,
				offset: 10,
			});

			expect(page2).toBeDefined();
			// Ensure different results
			if (page1.claims?.length > 0 && page2.claims?.length > 0) {
				expect(page1.claims[0].claimId).not.toBe(page2.claims[0].claimId);
			}
		}
	});
});
