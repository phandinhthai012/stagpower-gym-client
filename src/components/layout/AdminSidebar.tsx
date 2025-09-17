import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Package, 
  CreditCard, 
  Calendar, 
  BarChart3, 
  Settings,
  Home,
  UserCheck,
  Dumbbell
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Members', href: '/admin/members', icon: Users },
  { name: 'Trainers', href: '/admin/trainers', icon: UserCheck },
  { name: 'Packages', href: '/admin/packages', icon: Package },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { name: 'Schedules', href: '/admin/schedules', icon: Calendar },
  { name: 'Check-ins', href: '/admin/check-ins', icon: UserCheck },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  return (
    <div className="tw-w-64 border-r bg-background">
      <div className="tw-flex h-full flex-col">
        <div className="tw-flex h-14 items-center border-b px-6">
          <Dumbbell className="tw-h-6 w-6 text-primary" />
          <span className="tw-ml-2 text-lg font-semibold">StagPower</span>
        </div>
        
        <nav className="tw-flex-1 space-y-1 p-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )
              }
            >
              <item.icon className="tw-mr-3 h-4 w-4" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
