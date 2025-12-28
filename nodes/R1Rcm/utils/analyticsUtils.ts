/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Analytics Utilities
 *
 * Utilities for calculating RCM key performance indicators (KPIs).
 */

/**
 * Calculate Days in A/R
 * Formula: (Total A/R Balance / Average Daily Charges) = Days in A/R
 */
export function calculateDaysInAR(
  totalARBalance: number,
  averageDailyCharges: number,
): number {
  if (averageDailyCharges <= 0) return 0;
  return Math.round((totalARBalance / averageDailyCharges) * 100) / 100;
}

/**
 * Calculate Net Collection Rate
 * Formula: (Payments / (Charges - Contractual Adjustments)) * 100
 */
export function calculateNetCollectionRate(
  payments: number,
  charges: number,
  contractualAdjustments: number,
): number {
  const adjustedCharges = charges - contractualAdjustments;
  if (adjustedCharges <= 0) return 0;
  return Math.round((payments / adjustedCharges) * 100 * 100) / 100;
}

/**
 * Calculate Gross Collection Rate
 * Formula: (Payments / Charges) * 100
 */
export function calculateGrossCollectionRate(payments: number, charges: number): number {
  if (charges <= 0) return 0;
  return Math.round((payments / charges) * 100 * 100) / 100;
}

/**
 * Calculate Clean Claim Rate
 * Formula: (Claims Paid on First Submission / Total Claims Submitted) * 100
 */
export function calculateCleanClaimRate(
  claimsPaidFirstSubmission: number,
  totalClaimsSubmitted: number,
): number {
  if (totalClaimsSubmitted <= 0) return 0;
  return Math.round((claimsPaidFirstSubmission / totalClaimsSubmitted) * 100 * 100) / 100;
}

/**
 * Calculate Denial Rate
 * Formula: (Denied Claims / Total Claims) * 100
 */
export function calculateDenialRate(deniedClaims: number, totalClaims: number): number {
  if (totalClaims <= 0) return 0;
  return Math.round((deniedClaims / totalClaims) * 100 * 100) / 100;
}

/**
 * Calculate First Pass Resolution Rate
 * Formula: (Claims Resolved on First Pass / Total Claims) * 100
 */
export function calculateFirstPassResolutionRate(
  claimsResolvedFirstPass: number,
  totalClaims: number,
): number {
  if (totalClaims <= 0) return 0;
  return Math.round((claimsResolvedFirstPass / totalClaims) * 100 * 100) / 100;
}

/**
 * Calculate Average Days to Payment
 */
export function calculateAverageDaysToPayment(
  claims: Array<{ submitDate: string; paymentDate: string }>,
): number {
  if (claims.length === 0) return 0;

  const totalDays = claims.reduce((sum, claim) => {
    const submit = new Date(claim.submitDate);
    const payment = new Date(claim.paymentDate);
    const days = (payment.getTime() - submit.getTime()) / (1000 * 60 * 60 * 24);
    return sum + days;
  }, 0);

  return Math.round((totalDays / claims.length) * 100) / 100;
}

/**
 * Calculate A/R Aging Buckets
 */
export interface ARAgingBuckets {
  current: number; // 0-30 days
  days31to60: number;
  days61to90: number;
  days91to120: number;
  over120: number;
  total: number;
}

export function calculateARAgingBuckets(
  claims: Array<{ balance: number; ageInDays: number }>,
): ARAgingBuckets {
  const buckets: ARAgingBuckets = {
    current: 0,
    days31to60: 0,
    days61to90: 0,
    days91to120: 0,
    over120: 0,
    total: 0,
  };

  for (const claim of claims) {
    buckets.total += claim.balance;

    if (claim.ageInDays <= 30) {
      buckets.current += claim.balance;
    } else if (claim.ageInDays <= 60) {
      buckets.days31to60 += claim.balance;
    } else if (claim.ageInDays <= 90) {
      buckets.days61to90 += claim.balance;
    } else if (claim.ageInDays <= 120) {
      buckets.days91to120 += claim.balance;
    } else {
      buckets.over120 += claim.balance;
    }
  }

  // Round all values to 2 decimal places
  Object.keys(buckets).forEach((key) => {
    buckets[key as keyof ARAgingBuckets] =
      Math.round(buckets[key as keyof ARAgingBuckets] * 100) / 100;
  });

  return buckets;
}

/**
 * Calculate A/R Aging Percentages
 */
export function calculateARAgingPercentages(buckets: ARAgingBuckets): Record<string, number> {
  if (buckets.total === 0) {
    return {
      current: 0,
      days31to60: 0,
      days61to90: 0,
      days91to120: 0,
      over120: 0,
    };
  }

  return {
    current: Math.round((buckets.current / buckets.total) * 100 * 100) / 100,
    days31to60: Math.round((buckets.days31to60 / buckets.total) * 100 * 100) / 100,
    days61to90: Math.round((buckets.days61to90 / buckets.total) * 100 * 100) / 100,
    days91to120: Math.round((buckets.days91to120 / buckets.total) * 100 * 100) / 100,
    over120: Math.round((buckets.over120 / buckets.total) * 100 * 100) / 100,
  };
}

/**
 * Calculate Denial Recovery Rate
 * Formula: (Denied Claims Recovered / Total Denied Amount) * 100
 */
export function calculateDenialRecoveryRate(
  recoveredAmount: number,
  totalDeniedAmount: number,
): number {
  if (totalDeniedAmount <= 0) return 0;
  return Math.round((recoveredAmount / totalDeniedAmount) * 100 * 100) / 100;
}

/**
 * Calculate Cost to Collect
 * Formula: (Total Collection Costs / Total Collections) * 100
 */
export function calculateCostToCollect(
  totalCollectionCosts: number,
  totalCollections: number,
): number {
  if (totalCollections <= 0) return 0;
  return Math.round((totalCollectionCosts / totalCollections) * 100 * 100) / 100;
}

/**
 * Calculate Revenue Leakage
 * Formula: Expected Revenue - Actual Revenue
 */
export function calculateRevenueLeakage(
  expectedRevenue: number,
  actualRevenue: number,
): number {
  return Math.round((expectedRevenue - actualRevenue) * 100) / 100;
}

/**
 * Calculate Contract Compliance Rate
 * Formula: (Payments at Expected Rate / Total Payments) * 100
 */
export function calculateContractComplianceRate(
  paymentsAtExpectedRate: number,
  totalPayments: number,
): number {
  if (totalPayments <= 0) return 0;
  return Math.round((paymentsAtExpectedRate / totalPayments) * 100 * 100) / 100;
}

/**
 * KPI Dashboard Summary
 */
export interface KPIDashboard {
  daysInAR: number;
  netCollectionRate: number;
  grossCollectionRate: number;
  cleanClaimRate: number;
  denialRate: number;
  firstPassResolutionRate: number;
  averageDaysToPayment: number;
  denialRecoveryRate: number;
  costToCollect: number;
  contractComplianceRate: number;
  arAgingBuckets: ARAgingBuckets;
  arAgingPercentages: Record<string, number>;
}

/**
 * Calculate comprehensive KPI dashboard
 */
export function calculateKPIDashboard(data: {
  totalARBalance: number;
  averageDailyCharges: number;
  payments: number;
  charges: number;
  contractualAdjustments: number;
  claimsPaidFirstSubmission: number;
  totalClaimsSubmitted: number;
  deniedClaims: number;
  totalClaims: number;
  claimsResolvedFirstPass: number;
  claimsWithPaymentDates: Array<{ submitDate: string; paymentDate: string }>;
  recoveredDenialAmount: number;
  totalDeniedAmount: number;
  totalCollectionCosts: number;
  totalCollections: number;
  paymentsAtExpectedRate: number;
  totalPayments: number;
  claimsForAging: Array<{ balance: number; ageInDays: number }>;
}): KPIDashboard {
  const arAgingBuckets = calculateARAgingBuckets(data.claimsForAging);

  return {
    daysInAR: calculateDaysInAR(data.totalARBalance, data.averageDailyCharges),
    netCollectionRate: calculateNetCollectionRate(
      data.payments,
      data.charges,
      data.contractualAdjustments,
    ),
    grossCollectionRate: calculateGrossCollectionRate(data.payments, data.charges),
    cleanClaimRate: calculateCleanClaimRate(
      data.claimsPaidFirstSubmission,
      data.totalClaimsSubmitted,
    ),
    denialRate: calculateDenialRate(data.deniedClaims, data.totalClaims),
    firstPassResolutionRate: calculateFirstPassResolutionRate(
      data.claimsResolvedFirstPass,
      data.totalClaims,
    ),
    averageDaysToPayment: calculateAverageDaysToPayment(data.claimsWithPaymentDates),
    denialRecoveryRate: calculateDenialRecoveryRate(
      data.recoveredDenialAmount,
      data.totalDeniedAmount,
    ),
    costToCollect: calculateCostToCollect(data.totalCollectionCosts, data.totalCollections),
    contractComplianceRate: calculateContractComplianceRate(
      data.paymentsAtExpectedRate,
      data.totalPayments,
    ),
    arAgingBuckets,
    arAgingPercentages: calculateARAgingPercentages(arAgingBuckets),
  };
}

/**
 * Compare KPIs against benchmarks
 */
export interface BenchmarkComparison {
  metric: string;
  value: number;
  benchmark: number;
  variance: number;
  variancePercent: number;
  status: 'above' | 'at' | 'below';
}

export function compareAgainstBenchmarks(
  actuals: Record<string, number>,
  benchmarks: Record<string, number>,
): BenchmarkComparison[] {
  const comparisons: BenchmarkComparison[] = [];

  for (const [metric, value] of Object.entries(actuals)) {
    const benchmark = benchmarks[metric];
    if (benchmark !== undefined) {
      const variance = value - benchmark;
      const variancePercent =
        benchmark !== 0 ? Math.round((variance / benchmark) * 100 * 100) / 100 : 0;

      let status: 'above' | 'at' | 'below';
      if (Math.abs(variancePercent) <= 5) {
        status = 'at';
      } else if (variance > 0) {
        status = 'above';
      } else {
        status = 'below';
      }

      comparisons.push({
        metric,
        value,
        benchmark,
        variance: Math.round(variance * 100) / 100,
        variancePercent,
        status,
      });
    }
  }

  return comparisons;
}

/**
 * Industry benchmarks for reference
 */
export const INDUSTRY_BENCHMARKS = {
  daysInAR: 35,
  netCollectionRate: 95,
  cleanClaimRate: 95,
  denialRate: 5,
  firstPassResolutionRate: 90,
  averageDaysToPayment: 30,
  costToCollect: 3,
} as const;
