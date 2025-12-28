/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import { r1RcmApiRequest } from './r1RcmClient';
import { ENDPOINTS } from '../constants/endpoints';
import { EPIC_FHIR_RESOURCES, EPIC_INTEGRATION_STATUSES } from '../constants/epicTypes';

/**
 * Epic EHR Integration Client
 *
 * Handles integration with Epic EHR systems through R1 RCM's Epic gateway.
 */

export interface EpicPatient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  phone?: string;
  email?: string;
  insurances?: EpicInsurance[];
}

export interface EpicInsurance {
  payerId: string;
  payerName: string;
  memberId: string;
  groupNumber?: string;
  priority: 'primary' | 'secondary' | 'tertiary';
  effectiveDate?: string;
  terminationDate?: string;
}

export interface EpicEncounter {
  id: string;
  patientId: string;
  encounterType: string;
  status: string;
  serviceDate: string;
  department: string;
  provider: {
    npi: string;
    name: string;
  };
  diagnoses?: Array<{
    code: string;
    description: string;
    type: 'principal' | 'admitting' | 'other';
  }>;
  procedures?: Array<{
    code: string;
    description: string;
    datePerformed: string;
  }>;
}

export interface EpicCharge {
  id: string;
  encounterId: string;
  procedureCode: string;
  modifiers?: string[];
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  serviceDate: string;
  provider: {
    npi: string;
    name: string;
  };
  department: string;
  revenueCode?: string;
}

export interface EpicSyncResult {
  status: string;
  resourceType: string;
  resourceId: string;
  action: 'created' | 'updated' | 'skipped' | 'error';
  message?: string;
  timestamp: string;
}

/**
 * Get patient from Epic
 */
export async function getEpicPatient(
  context: IExecuteFunctions,
  patientId: string,
): Promise<EpicPatient> {
  const response = await r1RcmApiRequest<{ data: EpicPatient }>(context, {
    method: 'GET',
    endpoint: `${ENDPOINTS.epicIntegration.base}${ENDPOINTS.epicIntegration.patient}/${patientId}`,
  });

  return response.data;
}

/**
 * Search Epic patients
 */
export async function searchEpicPatients(
  context: IExecuteFunctions,
  searchParams: {
    mrn?: string;
    lastName?: string;
    firstName?: string;
    dateOfBirth?: string;
    ssn?: string;
  },
): Promise<EpicPatient[]> {
  const response = await r1RcmApiRequest<{ data: EpicPatient[] }>(context, {
    method: 'GET',
    endpoint: `${ENDPOINTS.epicIntegration.base}${ENDPOINTS.epicIntegration.patient}`,
    query: searchParams as Record<string, string>,
  });

  return response.data;
}

/**
 * Sync patient data between Epic and R1 RCM
 */
export async function syncPatientData(
  context: IExecuteFunctions,
  patientId: string,
  direction: 'epic-to-r1' | 'r1-to-epic' | 'bidirectional',
  options?: {
    includeInsurance?: boolean;
    includeEncounters?: boolean;
    includeCharges?: boolean;
  },
): Promise<EpicSyncResult[]> {
  const response = await r1RcmApiRequest<{ data: EpicSyncResult[] }>(context, {
    method: 'POST',
    endpoint: `${ENDPOINTS.epicIntegration.base}${ENDPOINTS.epicIntegration.sync}`,
    body: {
      patientId,
      direction,
      options: {
        includeInsurance: options?.includeInsurance ?? true,
        includeEncounters: options?.includeEncounters ?? true,
        includeCharges: options?.includeCharges ?? true,
      },
    },
  });

  return response.data;
}

/**
 * Get Epic encounter
 */
export async function getEpicEncounter(
  context: IExecuteFunctions,
  encounterId: string,
): Promise<EpicEncounter> {
  const response = await r1RcmApiRequest<{ data: EpicEncounter }>(context, {
    method: 'GET',
    endpoint: `${ENDPOINTS.epicIntegration.base}${ENDPOINTS.epicIntegration.encounter}/${encounterId}`,
  });

  return response.data;
}

/**
 * Get Epic charges for an encounter
 */
export async function getEpicCharges(
  context: IExecuteFunctions,
  encounterId: string,
): Promise<EpicCharge[]> {
  const response = await r1RcmApiRequest<{ data: EpicCharge[] }>(context, {
    method: 'GET',
    endpoint: `${ENDPOINTS.epicIntegration.base}${ENDPOINTS.epicIntegration.charges}`,
    query: { encounterId },
  });

  return response.data;
}

/**
 * Send data to Epic
 */
export async function sendToEpic(
  context: IExecuteFunctions,
  resourceType: keyof typeof EPIC_FHIR_RESOURCES,
  data: Record<string, unknown>,
): Promise<EpicSyncResult> {
  const response = await r1RcmApiRequest<{ data: EpicSyncResult }>(context, {
    method: 'POST',
    endpoint: `${ENDPOINTS.epicIntegration.base}${ENDPOINTS.epicIntegration.send}`,
    body: {
      resourceType: EPIC_FHIR_RESOURCES[resourceType],
      data,
    },
  });

  return response.data;
}

/**
 * Get Epic integration status
 */
export async function getEpicStatus(
  context: IExecuteFunctions,
  transactionId?: string,
): Promise<{
  status: keyof typeof EPIC_INTEGRATION_STATUSES;
  lastSync?: string;
  pendingItems?: number;
  errors?: Array<{
    code: string;
    message: string;
    timestamp: string;
  }>;
}> {
  const endpoint = transactionId
    ? `${ENDPOINTS.epicIntegration.base}${ENDPOINTS.epicIntegration.status}/${transactionId}`
    : `${ENDPOINTS.epicIntegration.base}${ENDPOINTS.epicIntegration.status}`;

  const response = await r1RcmApiRequest<{
    data: {
      status: keyof typeof EPIC_INTEGRATION_STATUSES;
      lastSync?: string;
      pendingItems?: number;
      errors?: Array<{ code: string; message: string; timestamp: string }>;
    };
  }>(context, {
    method: 'GET',
    endpoint,
  });

  return response.data;
}

/**
 * Reconcile Epic data with R1 RCM
 */
export async function reconcileEpicData(
  context: IExecuteFunctions,
  options: {
    resourceType?: keyof typeof EPIC_FHIR_RESOURCES;
    startDate?: string;
    endDate?: string;
    patientId?: string;
    encounterId?: string;
    autoResolve?: boolean;
  },
): Promise<{
  matched: number;
  conflicts: number;
  resolved: number;
  pending: number;
  details: Array<{
    resourceType: string;
    resourceId: string;
    status: string;
    conflictType?: string;
    resolution?: string;
  }>;
}> {
  const response = await r1RcmApiRequest<{
    data: {
      matched: number;
      conflicts: number;
      resolved: number;
      pending: number;
      details: Array<{
        resourceType: string;
        resourceId: string;
        status: string;
        conflictType?: string;
        resolution?: string;
      }>;
    };
  }>(context, {
    method: 'POST',
    endpoint: `${ENDPOINTS.epicIntegration.base}${ENDPOINTS.epicIntegration.reconcile}`,
    body: {
      resourceType: options.resourceType
        ? EPIC_FHIR_RESOURCES[options.resourceType]
        : undefined,
      startDate: options.startDate,
      endDate: options.endDate,
      patientId: options.patientId,
      encounterId: options.encounterId,
      autoResolve: options.autoResolve ?? false,
    },
  });

  return response.data;
}

/**
 * Get Epic integration queue
 */
export async function getEpicQueue(
  context: IExecuteFunctions,
  options?: {
    status?: string;
    resourceType?: keyof typeof EPIC_FHIR_RESOURCES;
    limit?: number;
    offset?: number;
  },
): Promise<{
  items: Array<{
    id: string;
    resourceType: string;
    resourceId: string;
    direction: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    error?: string;
  }>;
  total: number;
}> {
  const response = await r1RcmApiRequest<{
    data: {
      items: Array<{
        id: string;
        resourceType: string;
        resourceId: string;
        direction: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        error?: string;
      }>;
      total: number;
    };
  }>(context, {
    method: 'GET',
    endpoint: `${ENDPOINTS.epicIntegration.base}${ENDPOINTS.epicIntegration.queue}`,
    query: {
      status: options?.status,
      resourceType: options?.resourceType
        ? EPIC_FHIR_RESOURCES[options.resourceType]
        : undefined,
      limit: options?.limit,
      offset: options?.offset,
    },
  });

  return response.data;
}
