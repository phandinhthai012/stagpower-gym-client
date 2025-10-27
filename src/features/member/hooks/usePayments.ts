import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api/payment.api';
import { toast } from 'sonner';

export const usePayments = () => {
    return useQuery({
        queryKey: ['payments'],
        queryFn: paymentApi.getAllPayments,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const usePaymentById = (paymentId: string) => {
    return useQuery({
        queryKey: ['payment', paymentId],
        queryFn: () => paymentApi.getPaymentById(paymentId),
        enabled: !!paymentId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const usePaymentsByMemberId = (memberId: string) => {
    return useQuery({
        queryKey: ['payments', 'member', memberId],
        queryFn: () => paymentApi.getPaymentsByMemberId(memberId),
        enabled: !!memberId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export const useCreatePayment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => paymentApi.createPayment(data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payments', 'member', response.data.memberId] });
            toast.success('Payment record đã được tạo thành công!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi tạo payment: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useUpdatePayment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ paymentId, data }: { paymentId: string; data: any }) => 
            paymentApi.updatePayment(paymentId, data),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['paymentStats'] });
            queryClient.invalidateQueries({ queryKey: ['payments', 'member', response.data.memberId] });
            toast.success('Payment đã được cập nhật!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi cập nhật payment: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useCompletePayment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (paymentId: string) => paymentApi.completePayment(paymentId),
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payments', 'member', response.data.memberId] });
            toast.success('Payment đã được hoàn tất!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi hoàn tất payment: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useDeletePayment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (paymentId: string) => paymentApi.deletePayment(paymentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payments'] });
            queryClient.invalidateQueries({ queryKey: ['payments', 'member'] });
            toast.success('Payment đã được xóa!');
        },
        onError: (error: any) => {
            toast.error(`Lỗi khi xóa payment: ${error?.response?.data?.message || error?.message || 'Có lỗi xảy ra'}`);
        },
    });
}

export const useCreateMomoPayment = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => paymentApi.createMomoPayment(data),
        onSuccess: (response) => {
            // queryClient.invalidateQueries({ queryKey: ['payments'] });
            // if (response.data?.memberId) {
            //     queryClient.invalidateQueries({ 
            //         queryKey: ['payments', 'member', response.data.memberId] 
            //     });
            // }
            // ✅ KHÔNG toast ở đây - để component tự handle redirect/modal
            console.log('MoMo payment created:', response);
        },
        onError: (error: any) => {
            const errorMsg = error?.response?.data?.message || error?.message || 'Không thể tạo thanh toán MoMo';
            toast.error(`Lỗi MoMo: ${errorMsg}`);
        },
    });
};



export const usePaymentStats = () => {
    return useQuery({
        queryKey: ['paymentStats'],
        queryFn: paymentApi.getPaymentStats,
    });
};

// Helper function to calculate total spending from payments
export const calculateTotalSpending = (payments: any[]): number => {
  if (!payments || payments.length === 0) return 0;
  
  return payments
    .filter((payment: any) => payment.paymentStatus === 'Completed')
    .reduce((total: number, payment: any) => total + (payment.amount || 0), 0);
};

// Helper function to calculate revenue by month
export const calculateMonthlyRevenue = (payments: any[]) => {
  if (!payments || payments.length === 0) return [];
  
  const monthlyData: Record<string, number> = {};
  const currentYear = new Date().getFullYear();
  
  // Initialize all months
  for (let i = 0; i < 12; i++) {
    const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
    monthlyData[monthKey] = 0;
  }
  
  // Sum payments by month
  payments
    .filter((payment: any) => payment.paymentStatus === 'Completed')
    .forEach((payment: any) => {
      const date = new Date(payment.paymentDate || payment.createdAt);
      if (date.getFullYear() === currentYear) {
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] += payment.amount || 0;
      }
    });
  
  // Convert to array format for chart
  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, revenue], index) => ({
      month: `T${index + 1}`,
      revenue: revenue / 1000000, // Convert to millions
      fullDate: key,
    }));
};