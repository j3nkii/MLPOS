import 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useModalZussy, useToastZussy } from '@zussy';


import { customerService } from '@services';


export const useCustomerQuery = () => {
    const queryClient = useQueryClient();
    const { closeModal } = useModalZussy();
    const { addError, addSuccess } = useToastZussy();

    const createCustomer = useMutation({
        mutationFn: (body) => customerService.createCustomer(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allCustomers'] });
            addSuccess('Customer created.');
            closeModal();
        },
        onError: (error) => {
            addError('Customer creation failed.');
            console.error(error);
        },
    })

    const readCustomer = (customerID) =>{
        return useQuery({
            queryKey: ['customer', customerID],
            queryFn: () => customerService.readCustomer(customerID),
            enabled: !!customerID,
        })
    }

    const readAllCustomers = useQuery({
        queryKey: ['allCustomers'],
        queryFn: () => customerService.readAllCustomers(),
        onError: (error) => console.error(error),
    })

    const updateCustomer = useMutation({
        mutationFn: (body) => customerService.updateCustomer(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allCustomers'] });
            addSuccess('Customer updated.');
            closeModal();
        },
        onError: (error) => {
            addError('Customer update failed.');
            console.error(error);
        },
    })

    const deleteCustomer = useMutation({
        mutationFn: (customerID) => customerService.deleteCustomer(customerID),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allCustomers'] });
            addSuccess('Customer deleted.');
            closeModal();
        },
        onError: (error) => {
            addError('Customer deletion failed.');
            console.error(error)
        },
    })

    return {
        createCustomer,
        readCustomer,
        readAllCustomers,
        updateCustomer,
        deleteCustomer,
    }
}
