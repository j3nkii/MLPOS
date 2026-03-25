import 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useModalZussy} from '@zussy';


import { customerService } from '@services';


export const useCustomerQuery = () => {
    const queryClient = useQueryClient();
    const { closeModal } = useModalZussy();

    const createCustomer = useMutation({
        mutationFn: (body) => customerService.createCustomer(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allCustomers'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    })

    // const readCustomer = useQuery({
    //     queryKey: ['customer', customerID],
    //     queryFn: () => customerService.readCustomer(customerID),
    //     onSuccess: (res) => setSelectedCustomer(res.data),
    //     onError: (error) => console.error(error),
    //     enabled: !!customerID,
    // })

    const readAllCustomers = useQuery({
        queryKey: ['allCustomers'],
        queryFn: () => customerService.readAllCustomers(),
        onError: (error) => console.error(error),
    })

    const updateCustomer = useMutation({
        mutationFn: (body) => customerService.updateCustomer(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allCustomers'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    })

    const deleteCustomer = useMutation({
        mutationFn: (customerID) => customerService.deleteCustomer(customerID),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allCustomers'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    })

    return {
        createCustomer,
        // readCustomer,
        readAllCustomers,
        updateCustomer,
        deleteCustomer,
    }
}
