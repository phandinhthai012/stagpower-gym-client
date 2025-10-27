import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  variant = 'warning',
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-600',
          button: 'bg-red-600 hover:bg-red-700',
          iconBg: 'bg-red-100',
        };
      case 'warning':
        return {
          icon: 'text-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700',
          iconBg: 'bg-yellow-100',
        };
      case 'info':
        return {
          icon: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          iconBg: 'bg-blue-100',
        };
      default:
        return {
          icon: 'text-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700',
          iconBg: 'bg-yellow-100',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className={`p-2 ${styles.iconBg} rounded-lg`}>
                <AlertTriangle className={`w-5 h-5 ${styles.icon}`} />
              </div>
              {title}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <p className="text-gray-700 mb-6">{message}</p>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button
              type="button"
              className={styles.button}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

