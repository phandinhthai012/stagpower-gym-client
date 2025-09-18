import React from 'react';
import { MemberTable } from '../features/member/components/MemberTable';

interface MemberPageProps {
  onNavigate?: (page: string) => void;
}

export function MemberPage({ onNavigate }: MemberPageProps) {
  return (
    <div className="tw-container mx-auto py-6">
      <MemberTable />
    </div>
  );
}
