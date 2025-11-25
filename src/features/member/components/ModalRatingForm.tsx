import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useCreateRating, useUpdateRating } from '../hooks';
import { Rating, RateableTrainer } from '../types/rating.types';
import { toast } from 'sonner';
import { StarRating } from './StarRating';

interface ModalRatingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainer?: RateableTrainer;
  existingRating?: Rating;
  onSuccess: () => void;
}

export function ModalRatingForm({
  open,
  onOpenChange,
  trainer,
  existingRating,
  onSuccess
}: ModalRatingFormProps) {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [comment, setComment] = useState(existingRating?.comment || '');
  const createMutation = useCreateRating();
  const updateMutation = useUpdateRating();

  const isEditing = !!existingRating;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // Reset form when modal opens/closes or when editing rating changes
  useEffect(() => {
    if (open) {
      setRating(existingRating?.rating || 0);
      setComment(existingRating?.comment || '');
    } else {
      // Reset when closing
      setRating(0);
      setComment('');
    }
  }, [open, existingRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rating || rating < 1 || rating > 5) {
      toast.error('Vui lòng chọn đánh giá từ 1 đến 5 sao');
      return;
    }

    if (!trainer && !existingRating) {
      toast.error('Vui lòng chọn huấn luyện viên');
      return;
    }

    try {
      if (isEditing && existingRating) {
        await updateMutation.mutateAsync({
          ratingId: existingRating._id,
          data: { rating, comment }
        });
        toast.success('Cập nhật đánh giá thành công!');
      } else if (trainer) {
        await createMutation.mutateAsync({
          trainerId: trainer._id,
          rating,
          comment
        });
        toast.success('Tạo đánh giá thành công!');
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const trainerName = existingRating
    ? typeof existingRating.trainerId === 'object'
      ? existingRating.trainerId.fullName
      : 'PT'
    : trainer?.fullName || '';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px] bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEditing ? 'Chỉnh sửa đánh giá' : 'Đánh giá huấn luyện viên'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {trainerName && (
              <span className="font-semibold text-gray-900">{trainerName}</span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Đánh giá *</Label>
            <StarRating rating={rating} onRatingChange={setRating} />
            {rating > 0 && (
              <p className="text-sm text-gray-600">{rating} / 5 sao</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Nhận xét (tùy chọn)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về huấn luyện viên..."
              rows={4}
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 text-right">
              {comment.length} / 1000 ký tự
            </p>
          </div>

          <AlertDialogFooter className="flex flex-row justify-center sm:justify-between gap-2">
            <Button type="submit" disabled={isLoading || rating === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                isEditing ? 'Cập nhật' : 'Gửi đánh giá'
              )}
            </Button>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Hủy
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

