export { useCustomerQuery } from './sub/useCustomerQuery';
export { useAuthQuery } from './sub/useAuthQuery';
export { useTicketQuery } from './sub/useTicketQuery';
export { useUserQuery } from './sub/useUserQuery';
export { usePaymentQuery } from './sub/usePaymentQuery';
// ::PLOPPIN::


import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    }
});
