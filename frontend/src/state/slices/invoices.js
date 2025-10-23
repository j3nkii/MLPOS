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
            const { user } = get().user;
            setSlice({ isLoading: true, error: null });
            try {
                const res = await axios.get(`/api/invoices?userID=${user.id}`)
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
            const { invoiceForm, user } = get();
            const { fetchAllInvoices, closeModal } = get();
            setSlice({ isLoading: true, error: null });
            try {
                await axios.put(`/api/invoices/${invoiceID}`, {
                    ...invoiceForm,
                    userID: user.id
                });
                setSlice({ 
                    invoiceForm: { ...initialInvoiceForm },
                    isLoading: false 
                });
                await fetchAllInvoices();
                closeModal();
            } catch (err) {
                console.error(err);
                setSlice({ error: err.message });
            } finally {
                setSlice({ isLoading: false });
            }
        },

        createInvoice: async () => {
            const { invoiceForm, user } = get();
            const { fetchAllInvoices, closeModal } = get();
            setSlice({ isLoading: true, error: null });
            try {
                await axios.post('/api/invoices', {
                    ...invoiceForm,
                    userID: user.id
                });
                setSlice({ 
                    invoiceForm: { ...initialInvoiceForm },
                    isLoading: false 
                });
                await fetchAllInvoices();
                closeModal();
            } catch (err) {
                console.error(err);
                setSlice({ error: err.message });
            } finally {
                setSlice({ isLoading: false });
            }
        },

        deleteInvoice: async (invoiceId) => {
            setSlice({ isLoading: true, error: null });
            try {
                await axios.delete(`/api/invoices/${invoiceId}`);
                setSlice(state => ({
                    allInvoices: state.allInvoices.filter(c => c.id !== invoiceId),
                    isLoading: false
                }));
                get().closeModal();
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
            const { selectedInvoice } = get();
            setSlice({ invoiceForm: selectedInvoice });
        },

        resetInvoiceForm: () => {
            setSlice({ invoiceForm: { ...initialInvoiceForm } });
        },

        clearSelectedInvoice: () => setSlice({ selectedInvoice: null }),
}
};