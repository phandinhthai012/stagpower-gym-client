import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function AdminHeader() {
  return (
    <header className="tw-border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="tw-flex h-14 items-center justify-between px-6">
        <div className="tw-flex items-center space-x-4">
          <h1 className="tw-text-lg font-semibold">StagPower Gym Management</h1>
        </div>
        
        <div className="tw-flex items-center space-x-4">
          <div className="tw-relative">
            <Search className="tw-absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="tw-pl-8 w-64"
            />
          </div>
          
          <Button variant="ghost" size="icon">
            <Bell className="tw-h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <User className="tw-h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
