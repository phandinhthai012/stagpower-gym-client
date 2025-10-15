// src/types/api.types.ts
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: any;
  }
  
  export interface ApiError {
    success: false;
    message: string;
    error?: any;
    statusCode?: number;
  }
  
  export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    message?: string;
  }

  export type ApiResult<T = any> = ApiResponse<T> | ApiError;