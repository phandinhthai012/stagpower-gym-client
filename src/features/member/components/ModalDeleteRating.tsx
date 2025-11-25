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
} from '../../../components/ui/alert-dialog';
import { Button } from '../../../components/ui/button';
import { Loader2 } from 'lucide-react';
import { useDeleteRating } from '../hooks';
import { toast } from 'sonner';

interface ModalDeleteRatingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ratingId: string | null;
  onSuccess: () => void;
}

export function ModalDeleteRating({
  open,
  onOpenChange,
  ratingId,
  onSuccess
}: ModalDeleteRatingProps) {
  const deleteMutation = useDeleteRating();

  const handleDeleteConfirm = async () => {
    if (!ratingId) return;

    try {
      await deleteMutation.mutateAsync(ratingId);
      toast.success('Xóa đánh giá thành công!');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xóa đánh giá!');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa đánh giá</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa đánh giá này? Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!flex !flex-row !justify-center sm:!justify-between gap-2">
          <Button
            onClick={handleDeleteConfirm}
            disabled={deleteMutation.isPending}
            className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang xóa...
              </>
            ) : (
              'Xóa'
            )}
          </Button>
          <Button 
            variant="outline" 
            disabled={deleteMutation.isPending}
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-initial"
          >
            Hủy
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

