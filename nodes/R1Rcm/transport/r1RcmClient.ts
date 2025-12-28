/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, ILoadOptionsFunctions, IHttpRequestMethods } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { R1_RCM_ENVIRONMENTS, API_VERSION } from '../constants/endpoints';
import { sanitizeForLogging } from '../utils/hipaaUtils';

/**
 * R1 RCM API Client
 *
 * Main API client for R1 RCM Revenue Cycle Management platform.
 * Handles authentication, request signing, and error handling.
 */

export interface R1RcmApiCredentials {
  environment: 'production' | 'uat' | 'custom';
  customUrl?: string;
  clientId: string;
  clientSecret: string;
  apiKey?: string;
  organizationId: string;
  facilityId?: string;
  userId?: string;
}

export interface R1RcmRequestOptions {
  method?: IHttpRequestMethods;
  endpoint: string;
  body?: Record<string, unknown>;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  timeout?: number;
}

export interface R1RcmResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
  };
}

/**
 * Get the base URL for the R1 RCM API
 */
export function getBaseUrl(credentials: R1RcmApiCredentials): string {
  if (credentials.environment === 'custom' && credentials.customUrl) {
    return credentials.customUrl.replace(/\/$/, '');
  }
  return R1_RCM_ENVIRONMENTS[credentials.environment] || R1_RCM_ENVIRONMENTS.production;
}

/**
 * Token cache for OAuth tokens
 */
const tokenCache = new Map<
  string,
  {
    accessToken: string;
    expiresAt: number;
    refreshToken?: string;
  }
>();

/**
 * Get OAuth access token
 */
async function getAccessToken(
  context: IExecuteFunctions | ILoadOptionsFunctions,
  credentials: R1RcmApiCredentials,
): Promise<string> {
  const cacheKey = `${credentials.clientId}:${credentials.organizationId}`;
  const cached = tokenCache.get(cacheKey);

  // Return cached token if still valid (with 5 minute buffer)
  if (cached && cached.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cached.accessToken;
  }

  const baseUrl = getBaseUrl(credentials);
  const tokenUrl = `${baseUrl}/oauth/token`;

  try {
    const response = await context.helpers.httpRequest({
      method: 'POST',
      url: tokenUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        scope: 'read write',
      }).toString(),
    });

    const expiresIn = response.expires_in || 3600;
    const token = {
      accessToken: response.access_token,
      expiresAt: Date.now() + expiresIn * 1000,
      refreshToken: response.refresh_token,
    };

    tokenCache.set(cacheKey, token);
    return token.accessToken;
  } catch (error) {
    throw new NodeApiError(context.getNode(), error as object, {
      message: 'Failed to obtain OAuth access token',
    });
  }
}

/**
 * Make an authenticated request to R1 RCM API
 */
export async function r1RcmApiRequest<T = unknown>(
  context: IExecuteFunctions | ILoadOptionsFunctions,
  options: R1RcmRequestOptions,
): Promise<T> {
  const credentials = (await context.getCredentials('r1RcmApi')) as unknown as R1RcmApiCredentials;
  const accessToken = await getAccessToken(context, credentials);
  const baseUrl = getBaseUrl(credentials);

  const url = `${baseUrl}/${API_VERSION}${options.endpoint}`;

  // Build query string
  let queryString = '';
  if (options.query) {
    const params = new URLSearchParams();
    Object.entries(options.query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    queryString = params.toString();
  }

  const requestOptions = {
    method: options.method || 'GET',
    url: queryString ? `${url}?${queryString}` : url,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Organization-Id': credentials.organizationId,
      'X-Facility-Id': credentials.facilityId || '',
      'X-User-Id': credentials.userId || '',
      'X-API-Key': credentials.apiKey || '',
      'X-Request-Id': generateRequestId(),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    timeout: options.timeout || 30000,
  };

  try {
    const response = await context.helpers.httpRequest(requestOptions);
    return response as T;
  } catch (error: unknown) {
    // Sanitize any PHI in error messages
    const sanitizedError = sanitizeApiError(error);
    throw new NodeApiError(context.getNode(), sanitizedError as object, {
      message: sanitizedError.message || 'R1 RCM API request failed',
      httpCode: String(sanitizedError.statusCode || 500),
    });
  }
}

/**
 * Make a paginated request to R1 RCM API
 */
export async function r1RcmApiRequestAllItems<T = unknown>(
  context: IExecuteFunctions | ILoadOptionsFunctions,
  options: R1RcmRequestOptions,
  propertyName = 'data',
): Promise<T[]> {
  const returnData: T[] = [];
  let page = 1;
  const pageSize = 100;
  let hasMore = true;

  while (hasMore) {
    const query = {
      ...options.query,
      page,
      pageSize,
    };

    const response = await r1RcmApiRequest<R1RcmResponse<T[]>>(context, {
      ...options,
      query,
    });

    const items = (response as Record<string, unknown>)[propertyName] as T[] | undefined;
    if (items && Array.isArray(items)) {
      returnData.push(...items);
    }

    // Check if there are more pages
    const meta = response.meta;
    if (meta && meta.totalPages) {
      hasMore = page < meta.totalPages;
    } else if (items) {
      hasMore = items.length === pageSize;
    } else {
      hasMore = false;
    }

    page++;

    // Safety limit
    if (page > 100) {
      break;
    }
  }

  return returnData;
}

/**
 * Generate a unique request ID for tracing
 */
function generateRequestId(): string {
  return `r1rcm-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Sanitize API errors to remove any PHI
 */
function sanitizeApiError(error: unknown): { message: string; statusCode?: number } {
  const err = error as { message?: string; response?: { status?: number; data?: unknown } };
  
  // Extract basic error info without PHI
  let message = 'An error occurred with the R1 RCM API';
  let statusCode: number | undefined;

  if (err.message) {
    // Remove any potential PHI patterns from error message
    message = err.message
      .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN REDACTED]')
      .replace(/\b\d{10}\b/g, '[MRN REDACTED]')
      .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REDACTED]');
  }

  if (err.response?.status) {
    statusCode = err.response.status;
  }

  return { message, statusCode };
}

/**
 * Test connection to R1 RCM API
 */
export async function testConnection(
  context: IExecuteFunctions | ILoadOptionsFunctions,
): Promise<boolean> {
  try {
    await r1RcmApiRequest(context, {
      method: 'GET',
      endpoint: '/health',
    });
    return true;
  } catch {
    return false;
  }
}
