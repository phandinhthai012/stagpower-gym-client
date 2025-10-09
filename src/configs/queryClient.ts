import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // thời gian lưu dữ liệu trong cache
            refetchOnWindowFocus: false, // không refetch khi focus lại window
            refetchOnMount: true, // refetch khi mount lại
            refetchOnReconnect: true, // refetch khi reconnect
            retry: 1, // số lần retry khi lỗi
        },
        mutations: {
            retry: 1,
        },
    },
});
