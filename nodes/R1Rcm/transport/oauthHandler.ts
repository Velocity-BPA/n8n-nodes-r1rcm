/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { OAUTH_ENDPOINTS } from '../constants/endpoints';

/**
 * OAuth 2.0 Handler
 *
 * Manages OAuth authentication flows for R1 RCM API.
 */

export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  environment: 'production' | 'uat';
  scope?: string;
}

/**
 * Token storage interface
 */
interface TokenStore {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  tokenType: string;
}

// In-memory token cache (per client/org combination)
const tokenStore = new Map<string, TokenStore>();

/**
 * Get OAuth endpoint URLs based on environment
 */
export function getOAuthEndpoints(environment: 'production' | 'uat'): {
  authorize: string;
  token: string;
} {
  return OAUTH_ENDPOINTS[environment];
}

/**
 * Generate cache key for token storage
 */
function getCacheKey(config: OAuthConfig): string {
  return `${config.environment}:${config.clientId}`;
}

/**
 * Check if token is expired (with buffer)
 */
function isTokenExpired(expiresAt: number, bufferSeconds = 300): boolean {
  return Date.now() >= expiresAt - bufferSeconds * 1000;
}

/**
 * Request new access token using client credentials grant
 */
export async function getClientCredentialsToken(
  context: IExecuteFunctions | ILoadOptionsFunctions,
  config: OAuthConfig,
): Promise<OAuthTokenResponse> {
  const endpoints = getOAuthEndpoints(config.environment);

  try {
    const response = await context.helpers.httpRequest({
      method: 'POST',
      url: endpoints.token,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        scope: config.scope || 'read write',
      }).toString(),
    });

    // Store token
    const cacheKey = getCacheKey(config);
    tokenStore.set(cacheKey, {
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      expiresAt: Date.now() + response.expires_in * 1000,
      tokenType: response.token_type,
    });

    return response as OAuthTokenResponse;
  } catch (error) {
    throw new NodeApiError(context.getNode(), error as object, {
      message: 'Failed to obtain OAuth access token',
    });
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(
  context: IExecuteFunctions | ILoadOptionsFunctions,
  config: OAuthConfig,
  refreshToken: string,
): Promise<OAuthTokenResponse> {
  const endpoints = getOAuthEndpoints(config.environment);

  try {
    const response = await context.helpers.httpRequest({
      method: 'POST',
      url: endpoints.token,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: refreshToken,
      }).toString(),
    });

    // Update token store
    const cacheKey = getCacheKey(config);
    tokenStore.set(cacheKey, {
      accessToken: response.access_token,
      refreshToken: response.refresh_token || refreshToken,
      expiresAt: Date.now() + response.expires_in * 1000,
      tokenType: response.token_type,
    });

    return response as OAuthTokenResponse;
  } catch (error) {
    // If refresh fails, clear the cached token
    const cacheKey = getCacheKey(config);
    tokenStore.delete(cacheKey);

    throw new NodeApiError(context.getNode(), error as object, {
      message: 'Failed to refresh OAuth access token',
    });
  }
}

/**
 * Get valid access token (from cache or request new)
 */
export async function getValidAccessToken(
  context: IExecuteFunctions | ILoadOptionsFunctions,
  config: OAuthConfig,
): Promise<string> {
  const cacheKey = getCacheKey(config);
  const cached = tokenStore.get(cacheKey);

  // Return cached token if still valid
  if (cached && !isTokenExpired(cached.expiresAt)) {
    return cached.accessToken;
  }

  // Try to refresh if we have a refresh token
  if (cached?.refreshToken) {
    try {
      const refreshed = await refreshAccessToken(context, config, cached.refreshToken);
      return refreshed.access_token;
    } catch {
      // Refresh failed, get new token
    }
  }

  // Get new token using client credentials
  const newToken = await getClientCredentialsToken(context, config);
  return newToken.access_token;
}

/**
 * Revoke access token
 */
export async function revokeToken(
  context: IExecuteFunctions | ILoadOptionsFunctions,
  config: OAuthConfig,
  token: string,
): Promise<void> {
  const endpoints = getOAuthEndpoints(config.environment);

  try {
    await context.helpers.httpRequest({
      method: 'POST',
      url: `${endpoints.token}/revoke`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        token,
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }).toString(),
    });

    // Clear cached token
    const cacheKey = getCacheKey(config);
    tokenStore.delete(cacheKey);
  } catch (error) {
    throw new NodeApiError(context.getNode(), error as object, {
      message: 'Failed to revoke OAuth token',
    });
  }
}

/**
 * Clear cached tokens for a configuration
 */
export function clearTokenCache(config: OAuthConfig): void {
  const cacheKey = getCacheKey(config);
  tokenStore.delete(cacheKey);
}

/**
 * Clear all cached tokens
 */
export function clearAllTokens(): void {
  tokenStore.clear();
}

/**
 * Get token info (without exposing the actual token)
 */
export function getTokenInfo(config: OAuthConfig): {
  hasToken: boolean;
  expiresAt?: Date;
  hasRefreshToken: boolean;
} {
  const cacheKey = getCacheKey(config);
  const cached = tokenStore.get(cacheKey);

  if (!cached) {
    return {
      hasToken: false,
      hasRefreshToken: false,
    };
  }

  return {
    hasToken: true,
    expiresAt: new Date(cached.expiresAt),
    hasRefreshToken: !!cached.refreshToken,
  };
}
