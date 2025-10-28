import React from 'react';
import { Button } from './button';

interface TableAction {
  label: string;
  icon?: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  variant?: 'default' | 'outline' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
}

interface TableActionsProps {
  actions: TableAction[];
  stopPropagation?: boolean;
  className?: string;
}

/**
 * Component để render các action buttons trong table cell
 * Tự động stopPropagation để không trigger row click
 */
export function TableActions({ 
  actions, 
  stopPropagation = true,
  className = '' 
}: TableActionsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {actions.map((action, index) => (
        <Button
          key={index}
          size={action.size || 'sm'}
          variant={action.variant || 'outline'}
          disabled={action.disabled}
          onClick={(e) => {
            if (stopPropagation) {
              e.stopPropagation();
            }
            action.onClick(e);
          }}
        >
          {action.icon && <span className="mr-1">{action.icon}</span>}
          {action.label}
        </Button>
      ))}
    </div>
  );
}

