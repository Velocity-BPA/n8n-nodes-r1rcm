/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { ICredentialType, INodeProperties } from 'n8n-workflow';

/**
 * R1 RCM Integration Credentials
 *
 * Provides mutual TLS (mTLS) authentication for secure R1 RCM integrations.
 * Used for partner integrations and high-security data exchanges.
 */
export class R1RcmIntegration implements ICredentialType {
  name = 'r1RcmIntegration';
  displayName = 'R1 RCM Integration';
  documentationUrl = 'https://velobpa.com/docs/n8n-nodes-r1rcm';

  properties: INodeProperties[] = [
    {
      displayName: 'Integration Endpoint',
      name: 'integrationEndpoint',
      type: 'string',
      default: '',
      required: true,
      placeholder: 'https://integration.r1rcm.com',
      description: 'The R1 RCM integration endpoint URL',
    },
    {
      displayName: 'Partner ID',
      name: 'partnerId',
      type: 'string',
      default: '',
      required: true,
      description: 'Your R1 RCM Partner identifier',
    },
    {
      displayName: 'Client Certificate',
      name: 'certificate',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'PEM-encoded client certificate for mTLS authentication',
    },
    {
      displayName: 'Private Key',
      name: 'privateKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'PEM-encoded private key for mTLS authentication',
    },
    {
      displayName: 'Private Key Passphrase',
      name: 'privateKeyPassphrase',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'Passphrase for the private key (if encrypted)',
    },
    {
      displayName: 'CA Certificate',
      name: 'caCertificate',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'PEM-encoded CA certificate (if using custom CA)',
    },
  ];
}
