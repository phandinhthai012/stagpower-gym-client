import apiClient from '../../../configs/AxiosConfig';
import { API_ENDPOINTS } from '../../../configs/Api';

export interface BookingRequest {
  _id: string;
  memberId: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  } | string;
  trainerId: string;
  subscriptionId?: string;
  requestDateTime: string;
  duration: number;
  notes: string;
  status: 'Pending' | 'Confirmed' | 'Rejected';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequestRequest {
  memberId: string;
  trainerId: string;
  subscriptionId?: string;
  requestDateTime: string;
  duration: number;
  notes: string;
}

export interface UpdateBookingRequestRequest {
  requestDateTime?: string;
  duration?: number;
  notes?: string;
  status?: 'Pending' | 'Confirmed' | 'Rejected';
}

export const bookingRequestApi = {
  // Get all booking requests for a trainer
  getMyBookingRequests: async (trainerId: string): Promise<BookingRequest[]> => {
    const response = await apiClient.get(
      API_ENDPOINTS.BOOKING_REQUEST.GET_BOOKING_REQUEST_BY_TRAINERID(trainerId)
    );
    return response.data.data || [];
  },

  // Get booking request by ID
  getBookingRequestById: async (requestId: string): Promise<BookingRequest> => {
    const response = await apiClient.get(
      API_ENDPOINTS.BOOKING_REQUEST.GET_BOOKING_REQUEST_BY_ID(requestId)
    );
    return response.data.data;
  },

  // Confirm booking request (creates schedule)
  confirmBookingRequest: async (requestId: string): Promise<BookingRequest> => {
    const response = await apiClient.put(
      API_ENDPOINTS.BOOKING_REQUEST.CONFIRM_BOOKING_REQUEST(requestId)
    );
    return response.data.data;
  },

  // Reject booking request
  rejectBookingRequest: async (
    requestId: string,
    rejectReason: string
  ): Promise<BookingRequest> => {
    const response = await apiClient.put(
      API_ENDPOINTS.BOOKING_REQUEST.REJECT_BOOKING_REQUEST(requestId),
      { rejectReason }
    );
    return response.data.data;
  },

  // Update booking request
  updateBookingRequest: async (
    requestId: string,
    data: UpdateBookingRequestRequest
  ): Promise<BookingRequest> => {
    const response = await apiClient.put(
      API_ENDPOINTS.BOOKING_REQUEST.UPDATE_BOOKING_REQUEST(requestId),
      data
    );
    return response.data.data;
  },

  // Delete booking request
  deleteBookingRequest: async (requestId: string): Promise<void> => {
    await apiClient.delete(
      API_ENDPOINTS.BOOKING_REQUEST.DELETE_BOOKING_REQUEST(requestId)
    );
  },
};

