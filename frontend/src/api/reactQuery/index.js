import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export { useCustomerQuery } from './sub/useCustomerQuery';
export { useAuthQuery } from './sub/useAuthQuery';
export { useTicketQuery } from './sub/useTicketQuery';
export { useUserQuery } from './sub/useUserQuery';
export { usePaymentQuery } from './sub/usePaymentQuery';
export { useProductQuery } from './sub/useProductQuery';
// ::PLOPPIN::


import { QueryClient } from '@tanstack/react-query';
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
        }
    }
});


export function useAnyLoading() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();
  return fetching > 0 || mutating > 0;
}