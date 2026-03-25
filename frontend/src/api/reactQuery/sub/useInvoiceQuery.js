import 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useInvoice, useModal } from '@useZustand';


import { invoiceService } from '@services';


export const useInvoiceQuery = () => {
    const queryClient = useQueryClient();
    const { setSelectedInvoice, setAllInvoices, setLoading } = useInvoice();
    const { closeModal } = useModal();

    const _refreshInvoices = async() => {
        const res = await invoiceService.readAllInvoices();
        setAllInvoices(res.data);
    }

    const createInvoice = useMutation({
        mutationFn: ({ body }) => invoiceService.createInvoice(body),
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
        queryFn: () => invoiceService.readAllInvoices(),
        onError: (error) => console.error(error),
    });

    const updateInvoice = useMutation({
        mutationFn: ({ body }) => invoiceService.updateInvoice(body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['allInvoices'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    const deleteInvoice = useMutation({
        mutationFn: ({ invoiceID }) => invoiceService.deleteInvoice(invoiceID),
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
