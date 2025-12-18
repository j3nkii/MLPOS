import 'react';
import { useInvoice, useModal } from '@useState';


import { invoiceService } from '@services';


export const useInvoiceActions = () => {
    const { setSelectedInvoice, setAllInvoices, setLoading } = useInvoice();
    const { closModal } = useModal();

    const _refreshInvoices = async() => {
        const res = await invoiceService.readAllInvoices();
        setAllInvoices(res.data);
    }

    const createInvoice = async (body) => {
        try {
            setLoading(true);
            await invoiceService.createInvoice(body);
            _refreshInvoices();
            closModal();
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setLoading(false);
        }
    }

    const readInvoice = async (invoiceID) => {
        try {
            setLoading(true);
            const res = await invoiceService.readInvoice(invoiceID);
            setSelectedInvoice(res.data);
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setLoading(false);
        }
    }

    const readAllInvoices = async () => {
        try {
            setLoading(true);
            const res = await invoiceService.readAllInvoices();
            setAllInvoices(res.data);
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setLoading(false);
        }
    }

    const updateInvoice = async (invoiceID, body) => {
        try {
            setLoading(true);
            await invoiceService.updateInvoice(invoiceID, body);
            _refreshInvoices();
            closModal();
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setLoading(false);
        }
    }

    const deleteInvoice = async (invoiceID) => {
        try {
            setLoading(true);
            await invoiceService.deleteInvoice(invoiceID);
            _refreshInvoices();
            closModal();
        } catch (error) {
            console.error(error);
            // setError(error);
        } finally {
            setLoading(false);
        }
    }

    return {
        createInvoice,
        readInvoice,
        readAllInvoices,
        updateInvoice,
        deleteInvoice,
    }
}
