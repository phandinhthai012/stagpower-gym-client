import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';

import { Button } from '../button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../select';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="tw-flex items-center justify-between px-2">
      <div className="tw-flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{' '}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="tw-flex items-center space-x-6 lg:space-x-8">
        <div className="tw-flex items-center space-x-2">
          <p className="tw-text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="tw-h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="tw-flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="tw-flex items-center space-x-2">
          <Button
            variant="outline"
            className="tw-hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="tw-sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="tw-h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="tw-h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="tw-sr-only">Go to previous page</span>
            <ChevronLeftIcon className="tw-h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="tw-h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="tw-sr-only">Go to next page</span>
            <ChevronRightIcon className="tw-h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="tw-hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="tw-sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="tw-h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
