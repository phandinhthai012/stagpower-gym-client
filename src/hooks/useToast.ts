// hooks/useToast.ts
import { toast } from 'sonner';

export const useToast = () => {
  return {
    success: (message: string, description?: string) => 
      toast.success(message, { description }),
    
    error: (message: string, description?: string) => 
      toast.error(message, { description }),
    
    warning: (message: string, description?: string) => 
      toast.warning(message, { description }),
    
    info: (message: string, description?: string) => 
      toast.info(message, { description }),
    
    loading: (message: string) => 
      toast.loading(message),
    
    dismiss: (toastId?: string) => 
      toast.dismiss(toastId),
    
    promise: <T>(
      promise: Promise<T>,
      {
        loading,
        success,
        error,
      }: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: any) => string);
      }
    ) => toast.promise(promise, { loading, success, error })
  };
};