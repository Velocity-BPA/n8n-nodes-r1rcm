/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import * as SftpClient from 'ssh2-sftp-client';
import { Readable } from 'stream';
import { sanitizeForLogging } from '../utils/hipaaUtils';

/**
 * SFTP Client for R1 RCM file transfers
 *
 * Handles secure file transfers for:
 * - EDI files (837, 835, 270, 271, 276, 277, 278)
 * - Batch eligibility files
 * - Remittance advice files
 * - Report exports
 */

export interface SftpCredentials {
  host: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
  passphrase?: string;
  hostKey?: string;
  defaultDirectory?: string;
}

export interface SftpFileInfo {
  name: string;
  size: number;
  modifyTime: Date;
  accessTime: Date;
  type: 'd' | '-' | 'l';
  rights: {
    user: string;
    group: string;
    other: string;
  };
  owner: number;
  group: number;
}

export interface UploadResult {
  success: boolean;
  remotePath: string;
  size: number;
  timestamp: string;
}

export interface DownloadResult {
  success: boolean;
  content: Buffer | string;
  size: number;
  filename: string;
  timestamp: string;
}

/**
 * Get SFTP credentials from n8n
 */
async function getSftpCredentials(
  context: IExecuteFunctions,
): Promise<SftpCredentials> {
  const credentials = await context.getCredentials('r1RcmSftp');

  return {
    host: credentials.host as string,
    port: (credentials.port as number) || 22,
    username: credentials.username as string,
    password: credentials.password as string | undefined,
    privateKey: credentials.privateKey as string | undefined,
    passphrase: credentials.passphrase as string | undefined,
    hostKey: credentials.hostKey as string | undefined,
    defaultDirectory: credentials.defaultDirectory as string | undefined,
  };
}

/**
 * Create and connect SFTP client
 */
async function createSftpConnection(
  context: IExecuteFunctions,
): Promise<SftpClient> {
  const credentials = await getSftpCredentials(context);
  const client = new SftpClient();

  const config: SftpClient.ConnectOptions = {
    host: credentials.host,
    port: credentials.port,
    username: credentials.username,
  };

  // Use password or private key authentication
  if (credentials.privateKey) {
    config.privateKey = credentials.privateKey;
    if (credentials.passphrase) {
      config.passphrase = credentials.passphrase;
    }
  } else if (credentials.password) {
    config.password = credentials.password;
  }

  // Host key verification
  if (credentials.hostKey) {
    config.hostVerifier = (hostKey: string) => {
      return hostKey === credentials.hostKey;
    };
  }

  try {
    await client.connect(config);
    return client;
  } catch (error) {
    throw new NodeApiError(context.getNode(), error as Error, {
      message: `SFTP connection failed: ${(error as Error).message}`,
      description: 'Check your SFTP credentials and network connectivity',
    });
  }
}

/**
 * Upload file to SFTP server
 */
export async function uploadFile(
  context: IExecuteFunctions,
  content: Buffer | string | Readable,
  remotePath: string,
  options?: {
    encoding?: BufferEncoding;
    mode?: number;
    flags?: string;
    autoClose?: boolean;
  },
): Promise<UploadResult> {
  const client = await createSftpConnection(context);
  const credentials = await getSftpCredentials(context);

  try {
    // Resolve full path
    const fullPath = credentials.defaultDirectory
      ? `${credentials.defaultDirectory}/${remotePath}`.replace(/\/+/g, '/')
      : remotePath;

    // Ensure directory exists
    const directory = fullPath.substring(0, fullPath.lastIndexOf('/'));
    if (directory) {
      try {
        await client.mkdir(directory, true);
      } catch {
        // Directory might already exist
      }
    }

    // Upload file
    let uploadContent: Buffer | Readable;
    if (typeof content === 'string') {
      uploadContent = Buffer.from(content, options?.encoding || 'utf8');
    } else {
      uploadContent = content;
    }

    await client.put(uploadContent, fullPath, {
      writeStreamOptions: {
        flags: options?.flags || 'w',
        mode: options?.mode || 0o644,
        autoClose: options?.autoClose ?? true,
      },
    });

    // Get file info
    const stat = await client.stat(fullPath);

    return {
      success: true,
      remotePath: fullPath,
      size: stat.size,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new NodeApiError(context.getNode(), error as Error, {
      message: `SFTP upload failed: ${(error as Error).message}`,
      description: `Failed to upload file to ${remotePath}`,
    });
  } finally {
    await client.end();
  }
}

/**
 * Download file from SFTP server
 */
export async function downloadFile(
  context: IExecuteFunctions,
  remotePath: string,
  options?: {
    encoding?: BufferEncoding;
  },
): Promise<DownloadResult> {
  const client = await createSftpConnection(context);
  const credentials = await getSftpCredentials(context);

  try {
    // Resolve full path
    const fullPath = credentials.defaultDirectory
      ? `${credentials.defaultDirectory}/${remotePath}`.replace(/\/+/g, '/')
      : remotePath;

    // Check if file exists
    const exists = await client.exists(fullPath);
    if (!exists) {
      throw new Error(`File not found: ${fullPath}`);
    }

    // Download file
    const content = await client.get(fullPath);

    // Get file name from path
    const filename = fullPath.substring(fullPath.lastIndexOf('/') + 1);

    // Convert to string if encoding specified
    let result: Buffer | string;
    if (options?.encoding && Buffer.isBuffer(content)) {
      result = content.toString(options.encoding);
    } else if (Buffer.isBuffer(content)) {
      result = content;
    } else {
      result = content as unknown as Buffer;
    }

    return {
      success: true,
      content: result,
      size: Buffer.isBuffer(content) ? content.length : Buffer.byteLength(content as string),
      filename,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new NodeApiError(context.getNode(), error as Error, {
      message: `SFTP download failed: ${(error as Error).message}`,
      description: `Failed to download file from ${remotePath}`,
    });
  } finally {
    await client.end();
  }
}

/**
 * List files in directory
 */
export async function listFiles(
  context: IExecuteFunctions,
  remotePath?: string,
  options?: {
    pattern?: string | RegExp;
  },
): Promise<SftpFileInfo[]> {
  const client = await createSftpConnection(context);
  const credentials = await getSftpCredentials(context);

  try {
    // Resolve full path
    const fullPath = remotePath
      ? credentials.defaultDirectory
        ? `${credentials.defaultDirectory}/${remotePath}`.replace(/\/+/g, '/')
        : remotePath
      : credentials.defaultDirectory || '/';

    // List directory
    const files = await client.list(fullPath, options?.pattern);

    return files.map((file) => ({
      name: file.name,
      size: file.size,
      modifyTime: new Date(file.modifyTime),
      accessTime: new Date(file.accessTime),
      type: file.type as 'd' | '-' | 'l',
      rights: file.rights,
      owner: file.owner,
      group: file.group,
    }));
  } catch (error) {
    throw new NodeApiError(context.getNode(), error as Error, {
      message: `SFTP list failed: ${(error as Error).message}`,
      description: `Failed to list files in ${remotePath || 'default directory'}`,
    });
  } finally {
    await client.end();
  }
}

/**
 * Delete file from SFTP server
 */
export async function deleteFile(
  context: IExecuteFunctions,
  remotePath: string,
): Promise<{ success: boolean; deletedPath: string; timestamp: string }> {
  const client = await createSftpConnection(context);
  const credentials = await getSftpCredentials(context);

  try {
    // Resolve full path
    const fullPath = credentials.defaultDirectory
      ? `${credentials.defaultDirectory}/${remotePath}`.replace(/\/+/g, '/')
      : remotePath;

    // Check if file exists
    const exists = await client.exists(fullPath);
    if (!exists) {
      throw new Error(`File not found: ${fullPath}`);
    }

    // Delete file
    await client.delete(fullPath);

    return {
      success: true,
      deletedPath: fullPath,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new NodeApiError(context.getNode(), error as Error, {
      message: `SFTP delete failed: ${(error as Error).message}`,
      description: `Failed to delete file at ${remotePath}`,
    });
  } finally {
    await client.end();
  }
}

/**
 * Get file status/info
 */
export async function getFileStatus(
  context: IExecuteFunctions,
  remotePath: string,
): Promise<{
  exists: boolean;
  info?: SftpFileInfo;
}> {
  const client = await createSftpConnection(context);
  const credentials = await getSftpCredentials(context);

  try {
    // Resolve full path
    const fullPath = credentials.defaultDirectory
      ? `${credentials.defaultDirectory}/${remotePath}`.replace(/\/+/g, '/')
      : remotePath;

    // Check if file exists
    const exists = await client.exists(fullPath);
    if (!exists) {
      return { exists: false };
    }

    // Get file stats
    const stat = await client.stat(fullPath);

    return {
      exists: true,
      info: {
        name: remotePath.substring(remotePath.lastIndexOf('/') + 1),
        size: stat.size,
        modifyTime: new Date(stat.modifyTime),
        accessTime: new Date(stat.accessTime),
        type: stat.isDirectory ? 'd' : stat.isSymbolicLink ? 'l' : '-',
        rights: {
          user: '',
          group: '',
          other: '',
        },
        owner: stat.uid,
        group: stat.gid,
      },
    };
  } catch (error) {
    throw new NodeApiError(context.getNode(), error as Error, {
      message: `SFTP status check failed: ${(error as Error).message}`,
      description: `Failed to get status for ${remotePath}`,
    });
  } finally {
    await client.end();
  }
}

/**
 * Rename/move file
 */
export async function renameFile(
  context: IExecuteFunctions,
  oldPath: string,
  newPath: string,
): Promise<{ success: boolean; oldPath: string; newPath: string; timestamp: string }> {
  const client = await createSftpConnection(context);
  const credentials = await getSftpCredentials(context);

  try {
    // Resolve full paths
    const fullOldPath = credentials.defaultDirectory
      ? `${credentials.defaultDirectory}/${oldPath}`.replace(/\/+/g, '/')
      : oldPath;
    const fullNewPath = credentials.defaultDirectory
      ? `${credentials.defaultDirectory}/${newPath}`.replace(/\/+/g, '/')
      : newPath;

    // Rename/move file
    await client.rename(fullOldPath, fullNewPath);

    return {
      success: true,
      oldPath: fullOldPath,
      newPath: fullNewPath,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new NodeApiError(context.getNode(), error as Error, {
      message: `SFTP rename failed: ${(error as Error).message}`,
      description: `Failed to rename ${oldPath} to ${newPath}`,
    });
  } finally {
    await client.end();
  }
}

/**
 * Create directory
 */
export async function createDirectory(
  context: IExecuteFunctions,
  remotePath: string,
  recursive: boolean = true,
): Promise<{ success: boolean; path: string; timestamp: string }> {
  const client = await createSftpConnection(context);
  const credentials = await getSftpCredentials(context);

  try {
    // Resolve full path
    const fullPath = credentials.defaultDirectory
      ? `${credentials.defaultDirectory}/${remotePath}`.replace(/\/+/g, '/')
      : remotePath;

    // Create directory
    await client.mkdir(fullPath, recursive);

    return {
      success: true,
      path: fullPath,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new NodeApiError(context.getNode(), error as Error, {
      message: `SFTP mkdir failed: ${(error as Error).message}`,
      description: `Failed to create directory ${remotePath}`,
    });
  } finally {
    await client.end();
  }
}

/**
 * Test SFTP connection
 */
export async function testSftpConnection(
  context: IExecuteFunctions,
): Promise<{
  success: boolean;
  message: string;
  serverInfo?: {
    host: string;
    port: number;
    defaultDirectory?: string;
  };
}> {
  const client = await createSftpConnection(context);
  const credentials = await getSftpCredentials(context);

  try {
    // Try to get current directory
    const cwd = await client.cwd();

    return {
      success: true,
      message: 'SFTP connection successful',
      serverInfo: {
        host: credentials.host,
        port: credentials.port,
        defaultDirectory: credentials.defaultDirectory || cwd,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection failed: ${(error as Error).message}`,
    };
  } finally {
    await client.end();
  }
}
