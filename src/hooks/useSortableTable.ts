import { useState, useMemo } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig<T = any> {
  key: keyof T | string;
  direction: SortDirection;
}

export interface UseSortableTableOptions<T = any> {
  data: T[];
  initialSort?: SortConfig<T>;
}

export interface UseSortableTableReturn<T = any> {
  sortedData: T[];
  sortConfig: SortConfig<T>;
  requestSort: (key: keyof T | string) => void;
  getSortDirection: (key: keyof T | string) => SortDirection;
}

/**
 * Hook for sortable tables
 * @param data - Array of data to sort
 * @param initialSort - Initial sort configuration
 * @returns Sorted data and sort functions
 * 
 * @example
 * const { sortedData, requestSort, getSortDirection } = useSortableTable({
 *   data: members,
 *   initialSort: { key: 'fullName', direction: 'asc' }
 * });
 */
export function useSortableTable<T = any>({
  data,
  initialSort = { key: '', direction: null },
}: UseSortableTableOptions<T>): UseSortableTableReturn<T> {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(initialSort);

  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) {
      return data;
    }

    const sorted = [...data].sort((a: any, b: any) => {
      const aValue = getNestedValue(a, sortConfig.key as string);
      const bValue = getNestedValue(b, sortConfig.key as string);

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle different types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue, 'vi')
          : bValue.localeCompare(aValue, 'vi');
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      // Try to parse as dates if they're strings
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return sortConfig.direction === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      // Default string comparison
      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue), 'vi')
        : String(bValue).localeCompare(String(aValue), 'vi');
    });

    return sorted;
  }, [data, sortConfig]);

  const requestSort = (key: keyof T | string) => {
    let direction: SortDirection = 'asc';

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  const getSortDirection = (key: keyof T | string): SortDirection => {
    return sortConfig.key === key ? sortConfig.direction : null;
  };

  return {
    sortedData,
    sortConfig,
    requestSort,
    getSortDirection,
  };
}

/**
 * Get nested object value by dot notation path
 * @example getNestedValue(obj, 'user.profile.name')
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

