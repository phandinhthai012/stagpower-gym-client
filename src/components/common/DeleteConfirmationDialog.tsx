// src/components/common/DeleteConfirmationDialog.tsx
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isLoading = false
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-4 sm:mx-6 md:mx-8 lg:mx-0 w-full animate-in fade-in-0 zoom-in-95 duration-300 bg-white shadow-xl">
        <AlertDialogHeader className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-gray-600 leading-relaxed">
                {description}
                {itemName && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-red-200">
                    <span className="font-medium text-gray-900">
                      &ldquo;{itemName}&rdquo;
                    </span>
                  </div>
                )}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 mt-8">
          <AlertDialogCancel asChild>
            <Button 
              variant="outline" 
              disabled={isLoading}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Hủy
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild className="w-full sm:w-auto flex items-center justify-center space-x-2 order-1 sm:order-2 bg-red-500">
            <Button
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 order-1 sm:order-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang xóa...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}