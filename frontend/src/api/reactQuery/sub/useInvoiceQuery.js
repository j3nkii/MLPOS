import 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '@services';
import { useModalZussy} from '@zussy';
import { useNavigate } from 'react-router-dom';



export const useInvoiceQuery = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { closeModal } = useModalZussy();

    const _refreshInvoices = async() => {
        await queryClient.fetchQuery({
            queryKey: ['allInvoices'],
            queryFn: invoiceService.readAllInvoices,
            onError: (error) => console.error(error)
        });
    }

    const createInvoice = useMutation({
        mutationFn: invoiceService.createInvoice,
        onSuccess: async (result) => {
            navigate(`/invoices/${result.data.data.invoiceID}`)
            await _refreshInvoices()
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
        onSuccess: async () => {
            await _refreshInvoices()
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


    // ITEMS
    const updateInvoiceItem = useMutation({
        mutationFn: invoiceService.updateInvoiceItem,
        onSuccess: async () => {
            await _refreshInvoices()
            queryClient.invalidateQueries({ queryKey: ['allInvoices'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    const createInvoiceItem = useMutation({
        mutationFn: invoiceService.createInvoiceItem,
        onSuccess: async () => {
            // not super sure why this had to be done this way in order to work. invalidate was not refreshing data. 
            await _refreshInvoices()
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
        createInvoiceItem,
        updateInvoiceItem,
    }
}
