import axios from 'axios';

const initialInvoiceForm = {
    amount: '',
    invoice: '',
};


export const createInvoicesSlice = (set, get) => ({
    // State
    allInvoices: [],
    selectedInvoice: null,
    error: null,
    invoiceForm: { ...initialInvoiceForm },

    // Actions
    fetchAllInvoices: async () => {
        set({ isLoading: true, error: null });
        const { user } = get();
        try {
            const res = await axios.get(`/api/invoices?userID=${user.id}`)
            set({ allInvoices: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchInvoice: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`/api/invoices/${id}`);
            set({ selectedInvoice: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    updateInvoice: async (invoiceID) => {
        const { invoiceForm, user } = get();
        const { fetchAllInvoices, closeModal } = get();
        set({ isLoading: true, error: null });
        try {
            await axios.put(`/api/invoices/${invoiceID}`, {
                ...invoiceForm,
                userID: user.id
            });
            set({ 
                invoiceForm: { ...initialInvoiceForm },
                isLoading: false 
            });
            await fetchAllInvoices();
            closeModal();
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    submitNewInvoice: async () => {
        const { invoiceForm, user } = get();
        const { fetchAllInvoices, closeModal } = get();
        set({ isLoading: true, error: null });
        try {
            await axios.post('/api/invoices', {
                ...invoiceForm,
                userID: user.id
            });
            set({ 
                invoiceForm: { ...initialInvoiceForm },
                isLoading: false 
            });
            await fetchAllInvoices();
            closeModal();
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    deleteInvoice: async (invoiceId) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`/api/invoices/${invoiceId}`);
            set(state => ({
                allInvoices: state.allInvoices.filter(c => c.id !== invoiceId),
                isLoading: false
            }));
            get().closeModal();
        } catch (err) {
            console.error(err)
            set({ error: err.message, isLoading: false });
        }
    },

    setSelectedInvoice: (selectedInvoice) => set({ selectedInvoice }),

    setInvoiceForm: ({ name, value }) => {
        set(state => ({
            invoiceForm: { ...state.invoiceForm, [name]: value }
        }));
    },

    prepopulateInvoiceForm: () => {
        const { selectedInvoice } = get();
        set({ invoiceForm: selectedInvoice });
    },

    resetInvoiceForm: () => {
        set({ invoiceForm: { ...initialInvoiceForm } });
    },

    clearSelectedInvoice: () => set({ selectedInvoice: null }),
});