/* Copyright (c) Velocity BPA, LLC. Licensed under the Business Source License 1.1. See LICENSE file for details. Commercial use requires a separate license from Velocity BPA. */

/**
 * n8n-nodes-r1rcm
 * 
 * A comprehensive n8n community node for R1 RCM revenue cycle management platform.
 * Provides 22 resources and 200+ operations for healthcare revenue cycle automation.
 * 
 * Licensed under Business Source License 1.1 (BSL 1.1)
 * Commercial use requires a license from Velocity BPA.
 * 
 * @see https://velobpa.com/licensing
 */

// Export credential types
export { R1RcmApi } from './credentials/R1RcmApi.credentials';
export { R1RcmIntegration } from './credentials/R1RcmIntegration.credentials';
export { R1RcmSftp } from './credentials/R1RcmSftp.credentials';

// Export node types
export { R1Rcm } from './nodes/R1Rcm/R1Rcm.node';
export { R1RcmTrigger } from './nodes/R1Rcm/R1RcmTrigger.node';
