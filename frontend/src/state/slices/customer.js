// store/slices/customerSlice.js
import axios from 'axios';

const initialCustomerForm = {
    name: '',
    phone: '',
    email: '',
};
// const initialCustomerForm = {
//     name: '',
//     phone: '',
//     email: '',
//     address: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     customerType: 'regular', // regular, vip, wholesale
//     tags: [],
//     notes: '',
//     preferredContactMethod: 'phone', // phone, email, sms
// };


export const createCustomerSlice = (set, get) => {
    const setSlice = (partial) => set(state => ({
        customer: { ...state.customer, ...partial }
    }));
    return {
        // State
        allCustomers: [],
        selectedCustomer: null,
        customerForm: { ...initialCustomerForm },
        error: null,

        readCustomer: async (id) => {
            setSlice({ isLoading: true, error: null });
            try {
                const res = await axios.get(`/api/customers/${id}`);
                setSlice({ selectedCustomer: res.data, isLoading: false });
            } catch (err) {
                setSlice({ error: err.message, isLoading: false });
            }
        },

        readAllCustomers: async () => {
            setSlice({ isLoading: true, error: null });
            const { user } = get().auth;
            try {
                const res = await axios.get(`/api/customers?userID=${user.id}`)
                setSlice({ allCustomers: res.data, isLoading: false });
            } catch (err) {
                console.error(err)
                setSlice({ error: err.message, isLoading: false });
            }
        },

        updateCustomer: async (customerID) => {
            const { customerForm, user } = get();
            const { readAllCustomers, closeModal } = get();
            setSlice({ isLoading: true, error: null });
            try {
                await axios.put(`/api/customers/${customerID}`, {
                    ...customerForm,
                    userID: user.id
                });
                setSlice({ 
                    customerForm: { ...initialCustomerForm },
                    isLoading: false 
                });
                await readAllCustomers();
                closeModal();
            } catch (err) {
                setSlice({ error: err.message, isLoading: false });
            }
        },

        createCustomer: async () => {
            const { customerForm, user } = get();
            const { readAllCustomers, closeModal } = get();
            setSlice({ isLoading: true, error: null });
            try {
                await axios.post('/api/customers', {
                    ...customerForm,
                    userID: user.id
                });
                setSlice({ 
                    customerForm: { ...initialCustomerForm },
                    isLoading: false 
                });
                await readAllCustomers();
                closeModal();
            } catch (err) {
                setSlice({ error: err.message, isLoading: false });
            }
        },

        deleteCustomer: async (customerId) => {
            setSlice({ isLoading: true, error: null });
            try {
                await axios.delete(`/api/customers/${customerId}`);
                setSlice(state => ({
                    allCustomers: state.allCustomers.filter(c => c.id !== customerId),
                    isLoading: false
                }));
                get().closeModal();
            } catch (err) {
                console.error(err)
                setSlice({ error: err.message, isLoading: false });
            }
        },

        setSelectedCustomer: (selectedCustomer) => setSlice({ selectedCustomer }),

        setCustomerForm: ({ name, value }) => {
            setSlice(state => ({
                customerForm: { ...state.customerForm, [name]: value }
            }));
        },

        prepopulateCustomerForm: () => {
            const { selectedCustomer } = get();
            setSlice({ customerForm: selectedCustomer });
        },

        resetCustomerForm: () => {
            setSlice({ customerForm: { ...initialCustomerForm } });
        },

        clearSelectedCustomer: () => setSlice({ selectedCustomer: null }),
    }
};