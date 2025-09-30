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
    addNewCustomerForm: { ...initialCustomerForm },

    // Actions
    fetchAllCustomers: async () => {
        set({ isLoading: true, error: null });
        const { user } = get();
        try {
            const res = await axios.get(`/api/customers?userID=${user.id}`)
            console.log('#####', res)
            set({ allCustomers: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchCustomer: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`/api/customer/${id}`);
            set({ selectedCustomer: res.data, isLoading: false });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    submitNewCustomer: async () => {
        const { addNewCustomerForm, user } = get();
        const { fetchAllCustomers, closeModal } = get();
        set({ isLoading: true, error: null });
        try {
            await axios.post('/api/customer', {
                ...addNewCustomerForm,
                userID: user.id
            });
            set({ 
                addNewCustomerForm: { ...initialCustomerForm },
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
            await axios.delete(`/api/customer/${customerId}`);
            set(state => ({
                allCustomers: state.customers.filter(c => c.id !== customerId),
                isLoading: false
            }));
            get().closeModal();
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    clearSelectedCustomer: () => set({ selectedCustomer: null }),

    setCustomerForm: (field, value) => {
        set(state => ({
            addNewCustomerForm: { ...state.addNewCustomerForm, [field]: value }
        }));
    },

    resetCustomerForm: () => {
        set({ addNewCustomerForm: { ...initialCustomerForm } });
    }
});