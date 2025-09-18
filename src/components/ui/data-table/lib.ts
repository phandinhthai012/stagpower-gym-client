import { type Table, type Column } from '@tanstack/react-table';

export function getCommonPinningStyles<TData>({
  column,
}: {
  column: Column<TData, unknown>;
}) {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    position: isPinned ? 'sticky' : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    zIndex: isPinned ? 1 : undefined,
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px rgba(0, 0, 0, 0.1)'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px rgba(0, 0, 0, 0.1)'
        : undefined,
  };
}
