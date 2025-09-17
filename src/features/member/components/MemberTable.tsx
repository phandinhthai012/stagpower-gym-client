import React, { useMemo } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { DataTable } from '../../../components/ui/data-table';
import { mockUsers } from '../../../mockdata';
import { formatDate } from '../../../lib/date-utils';
import { Edit, Eye, Trash2 } from 'lucide-react';

type Member = typeof mockUsers[0];

const columnHelper = createColumnHelper<Member>();

export function MemberTable() {
  const members = useMemo(() => mockUsers.filter(user => user.role === 'Member'), []);

  const columns = useMemo(
    () => [
      columnHelper.accessor('full_name', {
        header: 'Tên',
        cell: (info) => (
          <div className="tw-flex items-center space-x-3">
            <div className="tw-h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="tw-text-sm font-medium">
                {info.getValue().split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="tw-font-medium">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('phone', {
        header: 'Số điện thoại',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('member_info.membership_level', {
        header: 'Loại thành viên',
        cell: (info) => {
          const level = info.getValue();
          return (
            <Badge variant={level === 'VIP' ? 'default' : 'secondary'}>
              {level}
            </Badge>
          );
        },
      }),
      columnHelper.accessor('status', {
        header: 'Trạng thái',
        cell: (info) => {
          const status = info.getValue();
          const variant = status === 'Active' ? 'success' : 
                         status === 'Inactive' ? 'secondary' : 'destructive';
          return <Badge variant={variant}>{status}</Badge>;
        },
      }),
      columnHelper.accessor('join_date', {
        header: 'Ngày tham gia',
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Thao tác',
        cell: (info) => (
          <div className="tw-flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Eye className="tw-h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Edit className="tw-h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="tw-h-4 w-4" />
            </Button>
          </div>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onRowClick: (row: Member) => {
        console.log('Row clicked:', row);
        // Handle row click - could open a detail modal or navigate to detail page
      },
    },
  });

  return (
    <div className="tw-space-y-4">
      <div className="tw-flex items-center justify-between">
        <h2 className="tw-text-2xl font-bold">Quản lý thành viên</h2>
        <Button>Thêm thành viên</Button>
      </div>
      
      <DataTable table={table} />
    </div>
  );
}
