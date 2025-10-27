import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingRequestApi } from '../api/bookingRequest.api';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'sonner';

export const bookingRequestQueryKeys = {
  all: ['trainer-booking-requests'] as const,
  myRequests: (trainerId: string) =>
    [...bookingRequestQueryKeys.all, 'my', trainerId] as const,
  detail: (id: string) => [...bookingRequestQueryKeys.all, 'detail', id] as const,
};

// Get all booking requests for the logged-in trainer
export const useMyBookingRequests = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: bookingRequestQueryKeys.myRequests(user?.id || ''),
    queryFn: () => bookingRequestApi.getMyBookingRequests(user?.id || ''),
    enabled: !!user?.id,
  });
};

// Get booking request by ID
export const useBookingRequestDetail = (requestId: string) => {
  return useQuery({
    queryKey: bookingRequestQueryKeys.detail(requestId),
    queryFn: () => bookingRequestApi.getBookingRequestById(requestId),
    enabled: !!requestId,
  });
};

// Confirm booking request
export const useConfirmBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      bookingRequestApi.confirmBookingRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingRequestQueryKeys.all });
      // Also invalidate schedules as a new schedule was created
      queryClient.invalidateQueries({ queryKey: ['trainer-schedules'] });
      toast.success('Đã xác nhận yêu cầu và tạo lịch thành công!');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Có lỗi xảy ra khi xác nhận yêu cầu!'
      );
    },
  });
};

// Reject booking request
export const useRejectBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ requestId, reason }: { requestId: string; reason: string }) =>
      bookingRequestApi.rejectBookingRequest(requestId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingRequestQueryKeys.all });
      toast.success('Đã từ chối yêu cầu!');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Có lỗi xảy ra khi từ chối yêu cầu!'
      );
    },
  });
};

// Update booking request
export const useUpdateBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data: any;
    }) => bookingRequestApi.updateBookingRequest(requestId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingRequestQueryKeys.all });
      toast.success('Cập nhật yêu cầu thành công!');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          'Có lỗi xảy ra khi cập nhật yêu cầu!'
      );
    },
  });
};

// Delete booking request
export const useDeleteBookingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (requestId: string) =>
      bookingRequestApi.deleteBookingRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingRequestQueryKeys.all });
      toast.success('Xóa yêu cầu thành công!');
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || 'Có lỗi xảy ra khi xóa yêu cầu!'
      );
    },
  });
};

