import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../constants/queryKeys';
import { invoiceApi } from '../api/invoice.api';
import { 
  Invoice, 
  CreateInvoiceData, 
  UpdateInvoiceData, 
  InvoiceSearchParams,
  PaymentRecord,
  CreatePaymentData,
  InvoiceStats
} from '../types/invoice.types';
import { useToast } from '../../../hooks/useToast';

// Query hooks
export const useInvoices = () => {
  return useQuery({
    queryKey: [queryKeys.invoices],
    queryFn: invoiceApi.getAllInvoices,
  });
};

export const useInvoiceById = (id: string) => {
  return useQuery({
    queryKey: [queryKeys.invoices, id],
    queryFn: () => invoiceApi.getInvoiceById(id),
    enabled: !!id,
  });
};

export const useSearchInvoices = (params: InvoiceSearchParams) => {
  return useQuery({
    queryKey: [queryKeys.invoices, 'search', params],
    queryFn: () => invoiceApi.searchInvoices(params),
  });
};

export const useInvoiceStats = () => {
  return useQuery({
    queryKey: [queryKeys.invoices, 'stats'],
    queryFn: invoiceApi.getInvoiceStats,
  });
};

export const useInvoicePayments = (invoiceId: string) => {
  return useQuery({
    queryKey: [queryKeys.invoices, invoiceId, 'payments'],
    queryFn: () => invoiceApi.getInvoicePayments(invoiceId),
    enabled: !!invoiceId,
  });
};

// Mutation hooks
export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: invoiceApi.createInvoice,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.invoices] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.invoices, 'stats'] });
      toast.success('Tạo hóa đơn thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo hóa đơn');
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceData }) =>
      invoiceApi.updateInvoice(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.invoices] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.invoices, variables.id] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.invoices, 'stats'] });
      toast.success('Cập nhật hóa đơn thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật hóa đơn');
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: invoiceApi.deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.invoices] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.invoices, 'stats'] });
      toast.success('Xóa hóa đơn thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa hóa đơn');
    },
  });
};

export const useRecordPayment = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: invoiceApi.recordPayment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.invoices] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.invoices, variables.invoiceId] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.invoices, variables.invoiceId, 'payments'] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.invoices, 'stats'] });
      toast.success('Ghi nhận thanh toán thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi ghi nhận thanh toán');
    },
  });
};

export const useSendPaymentReminder = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: invoiceApi.sendPaymentReminder,
    onSuccess: () => {
      toast.success('Gửi nhắc nhở thanh toán thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi nhắc nhở');
    },
  });
};

export const useBulkSendReminders = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: invoiceApi.bulkSendReminders,
    onSuccess: () => {
      toast.success('Gửi nhắc nhở hàng loạt thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi gửi nhắc nhở hàng loạt');
    },
  });
};

export const useExportInvoices = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: invoiceApi.exportInvoices,
    onSuccess: (blob, variables) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoices-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Xuất báo cáo thành công');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xuất báo cáo');
    },
  });
};
