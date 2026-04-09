import 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '@services';
import { useModalZussy} from '@zussy';



export const useInvoiceQuery = () => {
    const queryClient = useQueryClient();
    const { closeModal } = useModalZussy();

    const createInvoice = useMutation({
        mutationFn: invoiceService.createInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allInvoices'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    // const readInvoice = useQuery({
    //     queryKey: ['invocie', invoiceID],
    //     queryFn: () => invoiceService.readInvoice(invoiceID),
    //     onSuccess: (res) => setSelectedInvoice(res.data),
    //     onError: (error) => console.error(error),
    //     enabled: !!invoiceID,
    // })

    const readAllInvoices = useQuery({
        queryKey: ['allInvoices'],
        queryFn: invoiceService.readAllInvoices,
        onError: (error) => console.error(error),
    });

    const updateInvoice = useMutation({
        mutationFn: invoiceService.updateInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allInvoices'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    const deleteInvoice = useMutation({
        mutationFn: invoiceService.deleteInvoice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allInvoices'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    return {
        createInvoice,
        // readInvoice,
        readAllInvoices,
        updateInvoice,
        deleteInvoice,
    }
}
