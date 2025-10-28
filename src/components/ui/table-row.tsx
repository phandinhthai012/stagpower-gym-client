import React from 'react';

interface TableRowProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Component wrapper cho table row với xử lý click
 * Tự động thêm cursor-pointer và hover effect
 * Sử dụng cho các bảng cần click vào row để mở modal chi tiết
 */
export function ClickableTableRow({ 
  children, 
  onClick, 
  className = '', 
  disabled = false 
}: TableRowProps) {
  const baseClasses = 'hover:bg-gray-50 transition-colors';
  const cursorClass = onClick && !disabled ? 'cursor-pointer' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <tr
      className={`${baseClasses} ${cursorClass} ${disabledClass} ${className}`}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </tr>
  );
}

