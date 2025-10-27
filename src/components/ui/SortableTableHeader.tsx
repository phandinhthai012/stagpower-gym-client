import React from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { SortDirection } from '../../hooks/useSortableTable';

interface SortableTableHeaderProps {
  label: string;
  sortKey: string;
  currentSortKey?: string;
  sortDirection?: SortDirection;
  onSort: (key: string) => void;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

/**
 * Reusable sortable table header component
 * @example
 * <SortableTableHeader
 *   label="Tên hội viên"
 *   sortKey="fullName"
 *   currentSortKey={sortConfig.key}
 *   sortDirection={getSortDirection('fullName')}
 *   onSort={requestSort}
 * />
 */
export function SortableTableHeader({
  label,
  sortKey,
  currentSortKey,
  sortDirection,
  onSort,
  align = 'left',
  className = '',
}: SortableTableHeaderProps) {
  const isActive = currentSortKey === sortKey;
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  return (
    <th
      className={`p-2 font-medium text-gray-600 text-xs ${alignClass} ${className} cursor-pointer hover:bg-gray-100 transition-colors select-none group`}
      onClick={() => onSort(sortKey)}
    >
      <div className={`flex items-center gap-1 ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : ''}`}>
        <span>{label}</span>
        <div className="w-4 h-4 flex items-center justify-center">
          {!isActive && (
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
          {isActive && sortDirection === 'asc' && (
            <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
          )}
          {isActive && sortDirection === 'desc' && (
            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
          )}
        </div>
      </div>
    </th>
  );
}

/**
 * Non-sortable table header (for actions, checkboxes, etc.)
 */
export function NonSortableHeader({
  label,
  align = 'left',
  className = '',
  children,
}: {
  label?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  children?: React.ReactNode;
}) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';

  return (
    <th className={`p-2 font-medium text-gray-600 text-xs ${alignClass} ${className}`}>
      {children || label}
    </th>
  );
}

