import 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCustomer, useModal } from '@useZustand';


import { customerService } from '@services';


export const useCustomerQuery = () => {
    const { setSelectedCustomer, setAllCustomers, setLoading } = useCustomer();
    const { closeModal } = useModal();

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
        onSuccess: (res) => setAllCustomers(res.data),
        onError: (error) => console.error(error),
    })

    const updateCustomer = useMutation({
        mutationFn: (res) => customerService.updateCustomer(res.data),
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
