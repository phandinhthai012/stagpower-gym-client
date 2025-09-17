import { type Table as TanstackTable, flexRender } from '@tanstack/react-table';
import type * as React from 'react';

// Extend TableMeta to include onRowClick
declare module '@tanstack/react-table' {
  interface TableMeta<TData extends unknown> {
    onRowClick?: (row: TData) => void;
  }
}

import { DataTablePagination } from './data-table-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table';
import { getCommonPinningStyles } from './lib';
import { cn } from '../../../lib/utils';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  table: TanstackTable<TData>;
  TableProps?: React.ComponentProps<typeof Table>;
  emptyMessage?: string;
}

export function DataTable<TData>({
  table,
  children,
  className,
  TableProps,
  emptyMessage = 'No results.',
  ...props
}: DataTableProps<TData>) {
  // Get the onRowClick handler from table meta
  const onRowClick = table.options.meta?.onRowClick;

  // Handle row click events
  const handleRowClick = (row: any, event: React.MouseEvent) => {
    // Don't trigger row click if clicking on interactive elements
    const target = event.target as HTMLElement;
    const isInteractiveElement = target.closest(
      'button, input, [role="button"], [role="checkbox"], [data-radix-collection-item]'
    );

    if (!isInteractiveElement && onRowClick) {
      onRowClick(row.original);
    }
  };

  return (
    <div
      className={cn('flex w-full flex-col gap-2.5 overflow-auto', className)}
      {...props}
    >
      {children}

      <div className="overflow-hidden rounded-md border">
        <Table {...TableProps}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles({ column: header.column }),
                    } as React.CSSProperties}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    onRowClick && 'hover:bg-muted/40 cursor-pointer'
                  )}
                  onClick={
                    onRowClick ? event => handleRowClick(row, event) : undefined
                  }
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      } as React.CSSProperties}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
