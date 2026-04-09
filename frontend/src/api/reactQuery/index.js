export { useCustomerQuery } from './sub/useCustomerQuery';
export { useAuthQuery } from './sub/useAuthQuery';
export { useInvoiceQuery } from './sub/useInvoiceQuery';
export { useUserQuery } from './sub/useUserQuery';


import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    }
});