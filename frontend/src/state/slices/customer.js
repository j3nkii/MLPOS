// store/slices/customerSlice.js
import axios from 'axios';

const initialCustomerForm = {
    name: '',
    phone: '',
    email: '',
};

export const createCustomerSlice = (set, get) => ({
    // State
    allCustomers: [],
    selectedCustomer: null,
    error: null,
    customerForm: { ...initialCustomerForm },

    // Actions
    fetchAllCustomers: async () => {
        set({ isLoading: true, error: null });
        const { user } = get();
        try {
            const res = await axios.get(`/api/customers?userID=${user.id}`)
            set({ allCustomers: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchCustomer: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`/api/customers/${id}`);
            set({ selectedCustomer: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    updateCustomer: async (customerID) => {
        const { customerForm, user } = get();
        const { fetchAllCustomers, closeModal } = get();
        set({ isLoading: true, error: null });
        try {
            await axios.put(`/api/customers/${customerID}`, {
                ...customerForm,
                userID: user.id
            });
            set({ 
                customerForm: { ...initialCustomerForm },
                isLoading: false 
            });
            await fetchAllCustomers();
            closeModal();
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    submitNewCustomer: async () => {
        const { customerForm, user } = get();
        const { fetchAllCustomers, closeModal } = get();
        set({ isLoading: true, error: null });
        try {
            await axios.post('/api/customers', {
                ...customerForm,
                userID: user.id
            });
            set({ 
                customerForm: { ...initialCustomerForm },
                isLoading: false 
            });
            await fetchAllCustomers();
            closeModal();
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    deleteCustomer: async (customerId) => {
        set({ isLoading: true, error: null });
        try {
            await axios.delete(`/api/customers/${customerId}`);
            set(state => ({
                allCustomers: state.allCustomers.filter(c => c.id !== customerId),
                isLoading: false
            }));
            get().closeModal();
        } catch (err) {
            console.error(err)
            set({ error: err.message, isLoading: false });
        }
    },

    setSelectedCustomer: (selectedCustomer) => set({ selectedCustomer }),

    setCustomerForm: ({ name, value }) => {
        console.log('### FORM', name, value)
        set(state => ({
            customerForm: { ...state.customerForm, [name]: value }
        }));
    },

    prepopulateCustomerForm: () => {
        const { selectedCustomer } = get();
        set({ customerForm: selectedCustomer });
    },

    resetCustomerForm: () => {
        set({ customerForm: { ...initialCustomerForm } });
    },

    clearSelectedCustomer: () => set({ selectedCustomer: null }),
});