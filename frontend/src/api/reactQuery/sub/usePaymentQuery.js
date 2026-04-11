import 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@services';
import { useModalZussy} from '@zussy';



export const usePaymentQuery = () => {
    const queryClient = useQueryClient();
    const { closeModal } = useModalZussy();

    const createPayment = useMutation({
        mutationFn: paymentService.createPayment,
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ['allPayments'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    // const readPayment = useQuery({
    //     queryKey: ['invocie', paymentID],
    //     queryFn: () => paymentService.readPayment(paymentID),
    //     onSuccess: (res) => setSelectedPayment(res.data),
    //     onError: (error) => console.error(error),
    //     enabled: !!paymentID,
    // })

    // const readAllPayments = useQuery({
    //     queryKey: ['allPayments'],
    //     queryFn: paymentService.readAllPayments,
    //     onError: (error) => console.error(error),
    // });

    // const updatePayment = useMutation({
    //     mutationFn: paymentService.updatePayment,
    //     onSuccess: () => {
    //         // queryClient.invalidateQueries({ queryKey: ['allPayments'] });
    //         closeModal();
    //     },
    //     onError: (error) => console.error(error),
    // });

    // const deletePayment = useMutation({
    //     mutationFn: paymentService.deletePayment,
    //     onSuccess: () => {
    //         // queryClient.invalidateQueries({ queryKey: ['allPayments'] });
    //         closeModal();
    //     },
    //     onError: (error) => console.error(error),
    // });

    return {
        createPayment,
        // readPayment,
        // readAllPayments,
        // updatePayment,
        // deletePayment,
    }
}
