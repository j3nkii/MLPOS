import axios from 'axios';

const initialInvoiceForm = {
    amount: '',
    customerID: '',
};


export const createInvoicesSlice = (set, get) => {
    const setSlice = (partial) => set(state => {
        const result =  { invoice: { ...state.invoice, ...partial }}
        return result;
    });
    return {
        error: null,
        isLoading: false,
        allInvoices: [],
        selectedInvoice: null,
        invoiceForm: { ...initialInvoiceForm },

        readAllInvoices: async () => {
            const { user } = get().auth;
            setSlice({ isLoading: true, error: null });
            try {
                const res = await axios.get(`/api/invoice?userID=${user.id}`)
                setSlice({ allInvoices: res.data, isLoading: false });
            } catch (err) {
                console.error(err);
                setSlice({ error: err.message });
            } finally {
                setSlice({ isLoading: false });
            }
        },

        readInvoice: async (id) => {
            setSlice({ isLoading: true, error: null });
            try {
                const res = await axios.get(`/api/invoices/${id}`);
                setSlice({ selectedInvoice: res.data, isLoading: false });
            } catch (err) {
                console.error(err);
                setSlice({ error: err.message });
            } finally {
                setSlice({ isLoading: false });
            }
        },

        updateInvoice: async (invoiceID) => {
            const { invoiceForm, readAllInvoices } = get().invoice;
            const { closeModal } = get().modal;
            const { user } = get().auth;
            setSlice({ isLoading: true, error: null });
            try {
                await axios.put(`/api/invoice/${invoiceID}`, {
                    ...invoiceForm,
                    userID: user.id
                });
                setSlice({ 
                    invoiceForm: { ...initialInvoiceForm },
                    isLoading: false 
                });
                await readAllInvoices();
                closeModal();
            } catch (err) {
                console.error(err);
                setSlice({ error: err.message });
            } finally {
                setSlice({ isLoading: false });
            }
        },

        createInvoice: async () => {
            const { invoiceForm, readAllInvoices } = get().invoice;
            const { closeModal } = get().modal;
            const { user } = get().auth;
            setSlice({ isLoading: true, error: null });
            try {
                await axios.post('/api/invoice', {
                    ...invoiceForm,
                    userID: user.id
                });
                setSlice({ 
                    invoiceForm: { ...initialInvoiceForm },
                    isLoading: false 
                });
                await readAllInvoices();
                closeModal();
            } catch (err) {
                console.error(err);
                setSlice({ error: err.message });
            } finally {
                setSlice({ isLoading: false });
            }
        },

        deleteInvoice: async (invoiceId) => {
            const { readAllInvoices } = get().invoice;
            const { closeModal } = get().modal;
            setSlice({ isLoading: true, error: null });
            try {
                await axios.delete(`/api/invoice/${invoiceId}`);
                await readAllInvoices();
                closeModal();
            } catch (err) {
                console.error(err)
                setSlice({ error: err.message });
            } finally {
                setSlice({ isLoading: false });
            }
        },

        setSelectedInvoice: (selectedInvoice) => setSlice({ selectedInvoice }),

        setInvoiceForm: ({ name, value }) => {
            const { invoiceForm } = get().invoice;
            setSlice({ invoiceForm: { ...invoiceForm, [name]: value }});
        },

        prepopulateInvoiceForm: () => {
            const { item } = get().modal;
            setSlice({ invoiceForm: item });
        },

        resetInvoiceForm: () => {
            setSlice({ invoiceForm: { ...initialInvoiceForm } });
        },

        clearSelectedInvoice: () => setSlice({ selectedInvoice: null }),
}
};