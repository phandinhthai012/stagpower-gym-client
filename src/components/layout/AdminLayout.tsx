import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  return (
    <div className="tw-flex h-screen bg-background">
      <AdminSidebar />
      <div className="tw-flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="tw-flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
