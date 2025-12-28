/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

/**
 * R1 RCM API Credentials
 *
 * Provides OAuth 2.0 authentication for R1 RCM's Revenue Cycle Management platform.
 * Supports production, UAT/test, and custom endpoint environments.
 */
export class R1RcmApi implements ICredentialType {
  name = 'r1RcmApi';
  displayName = 'R1 RCM API';
  documentationUrl = 'https://velobpa.com/docs/n8n-nodes-r1rcm';

  properties: INodeProperties[] = [
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        {
          name: 'Production',
          value: 'production',
        },
        {
          name: 'Test/UAT',
          value: 'uat',
        },
        {
          name: 'Custom',
          value: 'custom',
        },
      ],
      default: 'production',
      description: 'The R1 RCM environment to connect to',
    },
    {
      displayName: 'Custom API URL',
      name: 'customUrl',
      type: 'string',
      default: '',
      placeholder: 'https://api.custom.r1rcm.com',
      description: 'Custom API endpoint URL (only for custom environment)',
      displayOptions: {
        show: {
          environment: ['custom'],
        },
      },
    },
    {
      displayName: 'Client ID',
      name: 'clientId',
      type: 'string',
      default: '',
      required: true,
      description: 'OAuth 2.0 Client ID from R1 RCM developer portal',
    },
    {
      displayName: 'Client Secret',
      name: 'clientSecret',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'OAuth 2.0 Client Secret from R1 RCM developer portal',
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'API Key for additional authentication (if required)',
    },
    {
      displayName: 'Organization ID',
      name: 'organizationId',
      type: 'string',
      default: '',
      required: true,
      description: 'Your R1 RCM Organization identifier',
    },
    {
      displayName: 'Facility ID',
      name: 'facilityId',
      type: 'string',
      default: '',
      description: 'Default Facility ID (can be overridden per request)',
    },
    {
      displayName: 'User ID',
      name: 'userId',
      type: 'string',
      default: '',
      description: 'User ID for audit logging (optional)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-Organization-Id': '={{$credentials.organizationId}}',
        'X-Facility-Id': '={{$credentials.facilityId}}',
        'X-User-Id': '={{$credentials.userId}}',
        'X-API-Key': '={{$credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL:
        '={{$credentials.environment === "production" ? "https://api.r1rcm.com" : $credentials.environment === "uat" ? "https://api.uat.r1rcm.com" : $credentials.customUrl}}',
      url: '/v1/health',
      method: 'GET',
    },
  };
}
