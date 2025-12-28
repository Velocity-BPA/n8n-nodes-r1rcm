/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * R1 RCM API Endpoints
 *
 * Centralized endpoint definitions for all R1 RCM API resources.
 */

export const R1_RCM_ENVIRONMENTS = {
  production: 'https://api.r1rcm.com',
  uat: 'https://api.uat.r1rcm.com',
} as const;

export const API_VERSION = 'v1';

export const ENDPOINTS = {
  // Authentication
  auth: {
    token: '/oauth/token',
    refresh: '/oauth/refresh',
    revoke: '/oauth/revoke',
  },

  // Patient Access
  patientAccess: {
    base: '/patient-access',
    patients: '/patients',
    demographics: '/demographics',
    identity: '/identity/verify',
    coverage: '/coverage',
    financialClearance: '/financial-clearance',
    estimate: '/responsibility-estimate',
    coverageDiscovery: '/coverage-discovery',
    propensityToPay: '/propensity-to-pay',
  },

  // Registration
  registration: {
    base: '/registration',
    status: '/status',
    complete: '/complete',
    cancel: '/cancel',
    preRegistration: '/pre-registration',
    queue: '/queue',
  },

  // Eligibility
  eligibility: {
    base: '/eligibility',
    check: '/check',
    realTime: '/real-time',
    batch: '/batch',
    benefits: '/benefits',
    coverage: '/coverage-details',
    deductible: '/deductible',
    copay: '/copay',
    priorAuth: '/prior-auth-requirements',
    history: '/history',
  },

  // Prior Authorization
  priorAuth: {
    base: '/prior-auth',
    submit: '/submit',
    status: '/status',
    cancel: '/cancel',
    reference: '/reference',
    requirements: '/requirements',
    track: '/track',
    queue: '/queue',
    history: '/history',
  },

  // Charge Capture
  chargeCapture: {
    base: '/charges',
    encounter: '/by-encounter',
    patient: '/by-patient',
    unbilled: '/unbilled',
    lag: '/lag',
    review: '/review',
    codingQueue: '/coding-queue',
  },

  // Coding
  coding: {
    base: '/coding',
    encounter: '/encounter',
    submit: '/submit',
    status: '/status',
    query: '/query',
    suggestions: '/suggestions',
    validate: '/validate',
    cciEdits: '/cci-edits',
    lcdNcd: '/lcd-ncd',
    queue: '/queue',
    productivity: '/productivity',
  },

  // Claims
  claim: {
    base: '/claims',
    submit: '/submit',
    status: '/status',
    void: '/void',
    resubmit: '/resubmit',
    correct: '/correct',
    history: '/history',
    lifecycle: '/lifecycle',
    patient: '/by-patient',
    errors: '/errors',
  },

  // Denials
  denial: {
    base: '/denials',
    analyze: '/analyze',
    reason: '/reason',
    rootCause: '/root-cause',
    appeal: '/appeal',
    appealStatus: '/appeal/status',
    trends: '/trends',
    prevention: '/prevention-recommendations',
    queue: '/queue',
  },

  // Payments
  payment: {
    base: '/payments',
    post: '/post',
    apply: '/apply',
    era: '/era',
    byCheck: '/by-check',
    byPayer: '/by-payer',
    unapplied: '/unapplied',
    reconcile: '/reconcile',
    variance: '/variance',
    contractVariance: '/contract-variance',
    underpayments: '/underpayments',
  },

  // A/R Management
  arManagement: {
    base: '/ar',
    aging: '/aging',
    byPayer: '/by-payer',
    byFacility: '/by-facility',
    highBalance: '/high-balance',
    followUp: '/follow-up-queue',
    assign: '/assign',
    workStatus: '/work-status',
    status: '/status',
    collection: '/collection-queue',
    badDebt: '/bad-debt-queue',
  },

  // Work Queue
  workQueue: {
    base: '/work-queues',
    items: '/items',
    assign: '/assign',
    complete: '/complete',
    transfer: '/transfer',
    metrics: '/metrics',
    byType: '/by-type',
    userWork: '/user-work',
    sla: '/sla',
  },

  // Analytics
  analytics: {
    base: '/analytics',
    revenue: '/revenue-dashboard',
    kpi: '/kpi-dashboard',
    arMetrics: '/ar-metrics',
    daysInAr: '/days-in-ar',
    collectionRate: '/collection-rate',
    cleanClaimRate: '/clean-claim-rate',
    denialRate: '/denial-rate',
    netCollectionRate: '/net-collection-rate',
    revenueTrends: '/revenue-trends',
    payerPerformance: '/payer-performance',
    providerPerformance: '/provider-performance',
    facilityPerformance: '/facility-performance',
    export: '/export',
  },

  // Reporting
  reporting: {
    base: '/reports',
    generate: '/generate',
    schedule: '/schedule',
    ar: '/ar-report',
    production: '/production-report',
    denial: '/denial-report',
    payment: '/payment-report',
    executive: '/executive-summary',
    custom: '/custom',
    export: '/export',
  },

  // Epic Integration
  epicIntegration: {
    base: '/epic',
    patient: '/patient',
    sync: '/sync',
    encounter: '/encounter',
    charges: '/charges',
    send: '/send',
    status: '/status',
    reconcile: '/reconcile',
    queue: '/queue',
  },

  // Contracts
  contract: {
    base: '/contracts',
    feeSchedule: '/fee-schedule',
    expectedPayment: '/expected-payment',
    compare: '/compare',
    variance: '/variance',
    underpaymentAnalysis: '/underpayment-analysis',
    terms: '/terms',
  },

  // Providers
  provider: {
    base: '/providers',
    search: '/search',
    credentials: '/credentials',
    performance: '/performance',
    productivity: '/productivity',
    validateNpi: '/validate-npi',
    enrolled: '/enrolled',
  },

  // Facilities
  facility: {
    base: '/facilities',
    performance: '/performance',
    metrics: '/metrics',
    ar: '/ar',
  },

  // Payers
  payer: {
    base: '/payers',
    rules: '/rules',
    performance: '/performance',
    trends: '/trends',
    contacts: '/contacts',
    status: '/status',
  },

  // Automation
  automation: {
    base: '/automation',
    rules: '/rules',
    status: '/status',
    botPerformance: '/bot-performance',
    queue: '/queue',
    intelligent: '/intelligent',
  },

  // SFTP
  sftp: {
    upload: '/upload',
    download: '/download',
    list: '/list',
    status: '/status',
    delete: '/delete',
  },

  // Webhooks
  webhook: {
    base: '/webhooks',
    test: '/test',
    events: '/events',
  },

  // Utility
  utility: {
    validateNpi: '/utility/validate-npi',
    validateTaxId: '/utility/validate-tax-id',
    codeLookup: '/utility/code-lookup',
    carcRarc: '/utility/carc-rarc',
    placeOfService: '/utility/place-of-service',
    health: '/health',
    status: '/status',
  },
} as const;

export const OAUTH_ENDPOINTS = {
  production: {
    authorize: 'https://auth.r1rcm.com/authorize',
    token: 'https://auth.r1rcm.com/token',
  },
  uat: {
    authorize: 'https://auth.uat.r1rcm.com/authorize',
    token: 'https://auth.uat.r1rcm.com/token',
  },
} as const;
