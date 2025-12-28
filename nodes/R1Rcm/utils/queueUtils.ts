/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Work Queue Utilities
 *
 * Utilities for managing RCM work queues and task assignments.
 */

import { WORK_QUEUE_PRIORITIES, SLA_LEVELS } from '../constants/workQueues';

/**
 * Work item interface
 */
export interface WorkItem {
  id: string;
  queueType: string;
  priority: number;
  status: string;
  patientId?: string;
  accountNumber?: string;
  claimId?: string;
  encounterId?: string;
  amount?: number;
  assignedTo?: string;
  createdAt: string;
  dueAt?: string;
  slaLevel?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Calculate SLA due date based on priority level
 */
export function calculateDueDate(
  createdAt: Date | string,
  slaLevel: keyof typeof SLA_LEVELS,
): Date {
  const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const sla = SLA_LEVELS[slaLevel];
  const dueDate = new Date(created.getTime() + sla.hours * 60 * 60 * 1000);
  return dueDate;
}

/**
 * Calculate remaining SLA time in hours
 */
export function calculateRemainingTime(dueAt: Date | string): number {
  const due = typeof dueAt === 'string' ? new Date(dueAt) : dueAt;
  const now = new Date();
  const remainingMs = due.getTime() - now.getTime();
  return Math.max(0, remainingMs / (60 * 60 * 1000));
}

/**
 * Check if SLA is breached
 */
export function isSLABreached(dueAt: Date | string): boolean {
  return calculateRemainingTime(dueAt) <= 0;
}

/**
 * Get SLA status (on-track, warning, breached)
 */
export function getSLAStatus(
  dueAt: Date | string,
  warningThresholdHours = 4,
): 'on-track' | 'warning' | 'breached' {
  const remaining = calculateRemainingTime(dueAt);

  if (remaining <= 0) return 'breached';
  if (remaining <= warningThresholdHours) return 'warning';
  return 'on-track';
}

/**
 * Sort work items by priority and due date
 */
export function sortWorkItems(items: WorkItem[]): WorkItem[] {
  return [...items].sort((a, b) => {
    // First sort by priority (lower number = higher priority)
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }

    // Then sort by due date (earlier = higher priority)
    if (a.dueAt && b.dueAt) {
      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
    }

    // Items with due dates come before items without
    if (a.dueAt && !b.dueAt) return -1;
    if (!a.dueAt && b.dueAt) return 1;

    // Finally sort by creation date
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
}

/**
 * Filter work items by queue type
 */
export function filterByQueueType(items: WorkItem[], queueType: string): WorkItem[] {
  return items.filter((item) => item.queueType === queueType);
}

/**
 * Filter work items by status
 */
export function filterByStatus(items: WorkItem[], status: string | string[]): WorkItem[] {
  const statuses = Array.isArray(status) ? status : [status];
  return items.filter((item) => statuses.includes(item.status));
}

/**
 * Filter work items by assignee
 */
export function filterByAssignee(items: WorkItem[], userId: string | null): WorkItem[] {
  if (userId === null) {
    return items.filter((item) => !item.assignedTo);
  }
  return items.filter((item) => item.assignedTo === userId);
}

/**
 * Get work items with breached SLA
 */
export function getBreachedItems(items: WorkItem[]): WorkItem[] {
  return items.filter((item) => item.dueAt && isSLABreached(item.dueAt));
}

/**
 * Get work items with SLA warning
 */
export function getWarningItems(items: WorkItem[], warningThresholdHours = 4): WorkItem[] {
  return items.filter(
    (item) => item.dueAt && getSLAStatus(item.dueAt, warningThresholdHours) === 'warning',
  );
}

/**
 * Calculate queue metrics
 */
export interface QueueMetrics {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  breached: number;
  atRisk: number;
  averageAgeHours: number;
  oldestItemHours: number;
}

export function calculateQueueMetrics(items: WorkItem[]): QueueMetrics {
  const now = new Date();

  const pending = items.filter((item) => item.status === 'pending').length;
  const inProgress = items.filter((item) => item.status === 'in-progress').length;
  const completed = items.filter((item) => item.status === 'completed').length;
  const breached = getBreachedItems(items).length;
  const atRisk = getWarningItems(items).length;

  // Calculate average age
  const ages = items.map((item) => {
    const created = new Date(item.createdAt);
    return (now.getTime() - created.getTime()) / (60 * 60 * 1000);
  });

  const averageAgeHours = ages.length > 0 ? ages.reduce((a, b) => a + b, 0) / ages.length : 0;
  const oldestItemHours = ages.length > 0 ? Math.max(...ages) : 0;

  return {
    total: items.length,
    pending,
    inProgress,
    completed,
    breached,
    atRisk,
    averageAgeHours: Math.round(averageAgeHours * 100) / 100,
    oldestItemHours: Math.round(oldestItemHours * 100) / 100,
  };
}

/**
 * Group work items by a field
 */
export function groupWorkItems<K extends keyof WorkItem>(
  items: WorkItem[],
  field: K,
): Map<WorkItem[K], WorkItem[]> {
  const groups = new Map<WorkItem[K], WorkItem[]>();

  for (const item of items) {
    const key = item[field];
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)?.push(item);
  }

  return groups;
}

/**
 * Calculate workload distribution by user
 */
export interface UserWorkload {
  userId: string;
  totalItems: number;
  pendingItems: number;
  breachedItems: number;
  atRiskItems: number;
}

export function calculateUserWorkloads(items: WorkItem[]): UserWorkload[] {
  const userGroups = groupWorkItems(items.filter((item) => item.assignedTo), 'assignedTo');
  const workloads: UserWorkload[] = [];

  userGroups.forEach((userItems, userId) => {
    if (userId) {
      workloads.push({
        userId,
        totalItems: userItems.length,
        pendingItems: filterByStatus(userItems, ['pending', 'in-progress']).length,
        breachedItems: getBreachedItems(userItems).length,
        atRiskItems: getWarningItems(userItems).length,
      });
    }
  });

  return workloads.sort((a, b) => b.totalItems - a.totalItems);
}

/**
 * Get priority label from numeric value
 */
export function getPriorityLabel(priority: number): string {
  const entry = Object.entries(WORK_QUEUE_PRIORITIES).find(([_, value]) => value === priority);
  return entry ? entry[0] : 'Unknown';
}

/**
 * Recommend next work item for a user based on priority and SLA
 */
export function recommendNextWorkItem(
  items: WorkItem[],
  userId?: string,
): WorkItem | undefined {
  // Filter to unassigned or assigned to this user
  const eligibleItems = items.filter(
    (item) =>
      (item.status === 'pending' || item.status === 'assigned') &&
      (!item.assignedTo || item.assignedTo === userId),
  );

  if (eligibleItems.length === 0) return undefined;

  // Sort by priority and SLA
  const sorted = sortWorkItems(eligibleItems);

  // Return the highest priority item
  return sorted[0];
}
