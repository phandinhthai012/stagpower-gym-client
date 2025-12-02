import { API_ENDPOINTS } from '../../../configs/Api';
import apiClient from '../../../configs/AxiosConfig';
import { 
  Invoice, 
  CreateInvoiceData, 
  UpdateInvoiceData, 
  InvoiceSearchParams,
  PaymentRecord,
  CreatePaymentData,
  InvoiceStats
} from '../types/invoice.types';

export const invoiceApi = {
  // Invoice endpoints
  getAllInvoices: async (): Promise<Invoice[]> => {
    const response = await apiClient.get(API_ENDPOINTS.INVOICE.GET_ALL_INVOICES);
    return response.data.data;
  },

  getInvoiceById: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get(`${API_ENDPOINTS.INVOICE.GET_INVOICE_BY_ID}/${id}`);
    return response.data.data;
  },

  createInvoice: async (data: CreateInvoiceData): Promise<Invoice> => {
    const response = await apiClient.post(API_ENDPOINTS.INVOICE.CREATE_INVOICE, data);
    return response.data.data;
  },

  updateInvoice: async (id: string, data: UpdateInvoiceData): Promise<Invoice> => {
    const response = await apiClient.put(`${API_ENDPOINTS.INVOICE.UPDATE_INVOICE}/${id}`, data);
    return response.data.data;
  },

  deleteInvoice: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.INVOICE.DELETE_INVOICE}/${id}`);
  },

  searchInvoices: async (params: InvoiceSearchParams): Promise<Invoice[]> => {
    const response = await apiClient.get(API_ENDPOINTS.INVOICE.SEARCH_INVOICES, { params });
    return response.data.data;
  },

  getInvoiceStats: async (): Promise<InvoiceStats> => {
    const response = await apiClient.get(API_ENDPOINTS.INVOICE.GET_INVOICE_STATS);
    return response.data.data;
  },

  // Payment endpoints
  recordPayment: async (data: CreatePaymentData): Promise<PaymentRecord> => {
    const response = await apiClient.post(API_ENDPOINTS.INVOICE.RECORD_PAYMENT, data);
    return response.data.data;
  },

  getInvoicePayments: async (invoiceId: string): Promise<PaymentRecord[]> => {
    const response = await apiClient.get(`${API_ENDPOINTS.INVOICE.GET_INVOICE_PAYMENTS}/${invoiceId}`);
    return response.data.data;
  },

  sendPaymentReminder: async (invoiceId: string): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.INVOICE.SEND_PAYMENT_REMINDER(invoiceId));
  },

  bulkSendReminders: async (invoiceIds: string[]): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.INVOICE.BULK_SEND_REMINDERS, { invoiceIds });
  },

  exportInvoices: async (params: InvoiceSearchParams): Promise<Blob> => {
    const response = await apiClient.get(API_ENDPOINTS.INVOICE.EXPORT_INVOICES, { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  createSubscriptionWithPayment: async (data: any): Promise<any> => {
    const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION.CREATE_SUBSCRIPTION_WITH_PAYMENT, data);
    return response.data.data;
  },
};
