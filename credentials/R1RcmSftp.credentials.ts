/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { ICredentialType, INodeProperties } from 'n8n-workflow';

/**
 * R1 RCM SFTP Credentials
 *
 * Provides SFTP authentication for secure file transfers with R1 RCM.
 * Used for batch file uploads/downloads (claims, remittances, reports).
 */
export class R1RcmSftp implements ICredentialType {
  name = 'r1RcmSftp';
  displayName = 'R1 RCM SFTP';
  documentationUrl = 'https://velobpa.com/docs/n8n-nodes-r1rcm';

  properties: INodeProperties[] = [
    {
      displayName: 'SFTP Host',
      name: 'host',
      type: 'string',
      default: '',
      required: true,
      placeholder: 'sftp.r1rcm.com',
      description: 'The R1 RCM SFTP server hostname',
    },
    {
      displayName: 'Port',
      name: 'port',
      type: 'number',
      default: 22,
      description: 'The SFTP server port (default: 22)',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      required: true,
      description: 'SFTP username',
    },
    {
      displayName: 'Authentication Method',
      name: 'authMethod',
      type: 'options',
      options: [
        {
          name: 'Password',
          value: 'password',
        },
        {
          name: 'SSH Key',
          value: 'sshKey',
        },
      ],
      default: 'password',
      description: 'Authentication method to use',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      displayOptions: {
        show: {
          authMethod: ['password'],
        },
      },
      description: 'SFTP password',
    },
    {
      displayName: 'SSH Private Key',
      name: 'sshKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      displayOptions: {
        show: {
          authMethod: ['sshKey'],
        },
      },
      description: 'PEM-encoded SSH private key',
    },
    {
      displayName: 'SSH Key Passphrase',
      name: 'sshKeyPassphrase',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      displayOptions: {
        show: {
          authMethod: ['sshKey'],
        },
      },
      description: 'Passphrase for the SSH private key (if encrypted)',
    },
    {
      displayName: 'Default Directory',
      name: 'defaultDirectory',
      type: 'string',
      default: '/',
      description: 'Default remote directory path',
    },
    {
      displayName: 'Host Key Verification',
      name: 'hostKeyVerification',
      type: 'boolean',
      default: true,
      description: 'Whether to verify the host key (recommended for production)',
    },
    {
      displayName: 'Known Host Key',
      name: 'hostKey',
      type: 'string',
      default: '',
      displayOptions: {
        show: {
          hostKeyVerification: [true],
        },
      },
      description: 'Expected SSH host key fingerprint',
    },
  ];
}
