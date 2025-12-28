/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeProperties,
} from 'n8n-workflow';
import { r1RcmApiRequest, r1RcmApiRequestAllItems } from '../../transport/r1RcmClient';
import { ENDPOINTS } from '../../constants/endpoints';

export const paymentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['payment'],
      },
    },
    options: [
      { name: 'Get Payment', value: 'getPayment', action: 'Get payment details' },
      { name: 'Post Payment', value: 'postPayment', action: 'Post a payment' },
      { name: 'Apply Payment', value: 'applyPayment', action: 'Apply payment to claims' },
      { name: 'Get ERA (835)', value: 'getERA', action: 'Get electronic remittance advice' },
      { name: 'Get Payment by Check', value: 'getPaymentByCheck', action: 'Get payment by check number' },
      { name: 'Get Payments by Payer', value: 'getPaymentsByPayer', action: 'Get payments by payer' },
      { name: 'Get Unapplied Payments', value: 'getUnappliedPayments', action: 'Get unapplied payments' },
      { name: 'Reconcile Payments', value: 'reconcilePayments', action: 'Reconcile payment batch' },
      { name: 'Get Payment Variance', value: 'getPaymentVariance', action: 'Get payment variance report' },
      { name: 'Get Contract Variance', value: 'getContractVariance', action: 'Get contract variance' },
      { name: 'Get Underpayments', value: 'getUnderpayments', action: 'Get underpayment analysis' },
    ],
    default: 'getPayment',
  },
];

export const paymentFields: INodeProperties[] = [
  {
    displayName: 'Payment ID',
    name: 'paymentId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getPayment', 'applyPayment'],
      },
    },
    default: '',
    description: 'The unique identifier for the payment',
  },
  {
    displayName: 'ERA ID',
    name: 'eraId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getERA'],
      },
    },
    default: '',
    description: 'The ERA/835 transaction ID',
  },
  {
    displayName: 'Check Number',
    name: 'checkNumber',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getPaymentByCheck'],
      },
    },
    default: '',
    description: 'The check or EFT number',
  },
  {
    displayName: 'Payer ID',
    name: 'payerId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getPaymentsByPayer'],
      },
    },
    default: '',
    description: 'The payer ID',
  },
  {
    displayName: 'Batch ID',
    name: 'batchId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['reconcilePayments'],
      },
    },
    default: '',
    description: 'The payment batch ID to reconcile',
  },
  // Post Payment
  {
    displayName: 'Payment Data',
    name: 'paymentData',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['postPayment'],
      },
    },
    default: {},
    options: [
      {
        name: 'payment',
        displayName: 'Payment',
        values: [
          {
            displayName: 'Payment Type',
            name: 'paymentType',
            type: 'options',
            options: [
              { name: 'Insurance', value: 'insurance' },
              { name: 'Patient', value: 'patient' },
              { name: 'Third Party', value: 'third_party' },
            ],
            default: 'insurance',
            description: 'Type of payment',
          },
          {
            displayName: 'Payer ID',
            name: 'payerId',
            type: 'string',
            default: '',
            description: 'Payer ID (for insurance payments)',
          },
          {
            displayName: 'Patient ID',
            name: 'patientId',
            type: 'string',
            default: '',
            description: 'Patient ID (for patient payments)',
          },
          {
            displayName: 'Payment Amount',
            name: 'paymentAmount',
            type: 'number',
            default: 0,
            description: 'Total payment amount',
          },
          {
            displayName: 'Payment Method',
            name: 'paymentMethod',
            type: 'options',
            options: [
              { name: 'EFT', value: 'eft' },
              { name: 'Check', value: 'check' },
              { name: 'Credit Card', value: 'credit_card' },
              { name: 'Cash', value: 'cash' },
              { name: 'Virtual Card', value: 'virtual_card' },
            ],
            default: 'eft',
            description: 'Method of payment',
          },
          {
            displayName: 'Check/Reference Number',
            name: 'referenceNumber',
            type: 'string',
            default: '',
            description: 'Check number or EFT reference',
          },
          {
            displayName: 'Payment Date',
            name: 'paymentDate',
            type: 'string',
            default: '',
            description: 'Payment date (YYYY-MM-DD)',
          },
          {
            displayName: 'Deposit Date',
            name: 'depositDate',
            type: 'string',
            default: '',
            description: 'Deposit date (YYYY-MM-DD)',
          },
        ],
      },
    ],
    description: 'Payment posting details',
  },
  // Apply Payment
  {
    displayName: 'Application Data',
    name: 'applicationData',
    type: 'fixedCollection',
    required: true,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['applyPayment'],
      },
    },
    default: {},
    options: [
      {
        name: 'application',
        displayName: 'Application',
        values: [
          {
            displayName: 'Claim ID',
            name: 'claimId',
            type: 'string',
            default: '',
            description: 'Claim to apply payment to',
          },
          {
            displayName: 'Line Number',
            name: 'lineNumber',
            type: 'number',
            default: 1,
            description: 'Claim line number',
          },
          {
            displayName: 'Applied Amount',
            name: 'appliedAmount',
            type: 'number',
            default: 0,
            description: 'Amount to apply',
          },
          {
            displayName: 'Adjustment Amount',
            name: 'adjustmentAmount',
            type: 'number',
            default: 0,
            description: 'Contractual adjustment amount',
          },
          {
            displayName: 'Adjustment Reason',
            name: 'adjustmentReason',
            type: 'string',
            default: '',
            description: 'CARC code for adjustment',
          },
        ],
      },
    ],
    description: 'Payment application details',
  },
  // Filters for various operations
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getPaymentsByPayer', 'getUnappliedPayments'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Date From',
        name: 'dateFrom',
        type: 'string',
        default: '',
        description: 'Payment date from (YYYY-MM-DD)',
      },
      {
        displayName: 'Date To',
        name: 'dateTo',
        type: 'string',
        default: '',
        description: 'Payment date to (YYYY-MM-DD)',
      },
      {
        displayName: 'Amount Min',
        name: 'amountMin',
        type: 'number',
        default: 0,
        description: 'Minimum payment amount',
      },
      {
        displayName: 'Amount Max',
        name: 'amountMax',
        type: 'number',
        default: 0,
        description: 'Maximum payment amount',
      },
    ],
  },
  // Variance/Underpayment filters
  {
    displayName: 'Variance Filters',
    name: 'varianceFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getPaymentVariance', 'getContractVariance', 'getUnderpayments'],
      },
    },
    default: {},
    options: [
      {
        displayName: 'Date From',
        name: 'dateFrom',
        type: 'string',
        default: '',
        description: 'Start date (YYYY-MM-DD)',
      },
      {
        displayName: 'Date To',
        name: 'dateTo',
        type: 'string',
        default: '',
        description: 'End date (YYYY-MM-DD)',
      },
      {
        displayName: 'Payer ID',
        name: 'payerId',
        type: 'string',
        default: '',
        description: 'Filter by payer',
      },
      {
        displayName: 'Contract ID',
        name: 'contractId',
        type: 'string',
        default: '',
        description: 'Filter by contract',
      },
      {
        displayName: 'Variance Threshold',
        name: 'varianceThreshold',
        type: 'number',
        default: 0,
        description: 'Minimum variance amount to include',
      },
      {
        displayName: 'Variance Percentage',
        name: 'variancePercentage',
        type: 'number',
        default: 0,
        description: 'Minimum variance percentage to include',
      },
    ],
  },
];

export async function executePaymentOperation(
  this: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  const operation = this.getNodeParameter('operation', index) as string;
  let response: unknown;

  switch (operation) {
    case 'getPayment': {
      const paymentId = this.getNodeParameter('paymentId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.PAYMENT.GET}/${paymentId}`,
      });
      break;
    }

    case 'postPayment': {
      const paymentData = this.getNodeParameter('paymentData', index) as { payment?: Record<string, unknown> };

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: ENDPOINTS.PAYMENT.POST,
        body: paymentData.payment || {},
      });
      break;
    }

    case 'applyPayment': {
      const paymentId = this.getNodeParameter('paymentId', index) as string;
      const applicationData = this.getNodeParameter('applicationData', index) as { application?: Record<string, unknown> };

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.PAYMENT.APPLY}/${paymentId}`,
        body: applicationData.application || {},
      });
      break;
    }

    case 'getERA': {
      const eraId = this.getNodeParameter('eraId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.PAYMENT.ERA}/${eraId}`,
      });
      break;
    }

    case 'getPaymentByCheck': {
      const checkNumber = this.getNodeParameter('checkNumber', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.PAYMENT.BY_CHECK,
        query: { checkNumber },
      });
      break;
    }

    case 'getPaymentsByPayer': {
      const payerId = this.getNodeParameter('payerId', index) as string;
      const filters = this.getNodeParameter('filters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: `${ENDPOINTS.PAYMENT.BY_PAYER}/${payerId}`,
        query: {
          dateFrom: filters.dateFrom as string,
          dateTo: filters.dateTo as string,
          amountMin: filters.amountMin as number,
          amountMax: filters.amountMax as number,
        },
      });
      break;
    }

    case 'getUnappliedPayments': {
      const filters = this.getNodeParameter('filters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: ENDPOINTS.PAYMENT.UNAPPLIED,
        query: {
          dateFrom: filters.dateFrom as string,
          dateTo: filters.dateTo as string,
          amountMin: filters.amountMin as number,
          amountMax: filters.amountMax as number,
        },
      });
      break;
    }

    case 'reconcilePayments': {
      const batchId = this.getNodeParameter('batchId', index) as string;

      response = await r1RcmApiRequest(this, {
        method: 'POST',
        endpoint: `${ENDPOINTS.PAYMENT.RECONCILE}/${batchId}`,
      });
      break;
    }

    case 'getPaymentVariance': {
      const varianceFilters = this.getNodeParameter('varianceFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.PAYMENT.VARIANCE,
        query: {
          dateFrom: varianceFilters.dateFrom as string,
          dateTo: varianceFilters.dateTo as string,
          payerId: varianceFilters.payerId as string,
          contractId: varianceFilters.contractId as string,
          varianceThreshold: varianceFilters.varianceThreshold as number,
          variancePercentage: varianceFilters.variancePercentage as number,
        },
      });
      break;
    }

    case 'getContractVariance': {
      const varianceFilters = this.getNodeParameter('varianceFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequest(this, {
        method: 'GET',
        endpoint: ENDPOINTS.PAYMENT.CONTRACT_VARIANCE,
        query: {
          dateFrom: varianceFilters.dateFrom as string,
          dateTo: varianceFilters.dateTo as string,
          payerId: varianceFilters.payerId as string,
          contractId: varianceFilters.contractId as string,
          varianceThreshold: varianceFilters.varianceThreshold as number,
        },
      });
      break;
    }

    case 'getUnderpayments': {
      const varianceFilters = this.getNodeParameter('varianceFilters', index, {}) as Record<string, unknown>;

      response = await r1RcmApiRequestAllItems(this, {
        method: 'GET',
        endpoint: ENDPOINTS.PAYMENT.UNDERPAYMENTS,
        query: {
          dateFrom: varianceFilters.dateFrom as string,
          dateTo: varianceFilters.dateTo as string,
          payerId: varianceFilters.payerId as string,
          contractId: varianceFilters.contractId as string,
          varianceThreshold: varianceFilters.varianceThreshold as number,
        },
      });
      break;
    }

    default:
      throw new Error(`Operation ${operation} not supported`);
  }

  return [{ json: response as Record<string, unknown> }];
}
