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
    const setSlice = (partial) => set(state => {
        const result =  { customer: { ...state.customer, ...partial }}
        return result;
    });
    return {
        error: null,
        isLoading: false,
        allCustomers: [],
        selectedCustomer: null,
        customerForm: { ...initialCustomerForm },

        // readCustomer: async (id) => {
        //     setSlice({ isLoading: true, error: null });
        //     try {
        //         const res = await axios.get(`/api/customers/${id}`);
        //         setSlice({ selectedCustomer: res.data, isLoading: false });
        //     } catch (err) {
        //         setSlice({ error: err.message, isLoading: false });
        //     }
        // },

        // readAllCustomers: async () => {
        //     setSlice({ isLoading: true, error: null });
        //     const { user } = get().auth;
        //     try {
        //         const res = await axios.get(`/api/customers?userID=${user.id}`)
        //         setSlice({ allCustomers: res.data });
        //     } catch (err) {
        //         console.error(err);
        //         setSlice({ error: err.message });
        //     } finally {
        //         setSlice({ isLoading: false });
        //     }
        // },

        // updateCustomer: async (customerID) => {
        //     const { customerForm, readAllCustomers } = get().customer;
        //     const { closeModal } = get().modal;
        //     const { user } = get().auth;
        //     setSlice({ isLoading: true, error: null });
        //     try {
        //         await axios.put(`/api/customers/${customerID}`, {
        //             ...customerForm,
        //             userID: user.id
        //         });
        //         setSlice({ customerForm: { ...initialCustomerForm }});
        //         await readAllCustomers();
        //         closeModal();
        //     } catch (err) {
        //         console.error(err);
        //         setSlice({ error: err.message });
        //     } finally {
        //         setSlice({ isLoading: false });
        //     }
        // },

        // createCustomer: async () => {
        //     const { customerForm, readAllCustomers } = get().customer;
        //     const { closeModal } = get().modal;
        //     const { user } = get().auth;
        //     setSlice({ isLoading: true, error: null });
        //     try {
        //         await axios.post('/api/customers', {
        //             ...customerForm,
        //             userID: user.id
        //         });
        //         setSlice({ customerForm: { ...initialCustomerForm }});
        //         await readAllCustomers();
        //         closeModal();
        //     } catch (err) {
        //         console.error(err);
        //         setSlice({ error: err.message });
        //     } finally {
        //         setSlice({ isLoading: false });
        //     }
        // },

        // deleteCustomer: async (customerId) => {
        //     const { readAllCustomers } = get().customer;
        //     const { closeModal } = get().modal;
        //     setSlice({ isLoading: true, error: null });
        //     try {
        //         await axios.delete(`/api/customers/${customerId}`);
        //         await readAllCustomers();
        //         closeModal();
        //     } catch (err) {
        //         console.error(err);
        //         setSlice({ error: err.message });
        //     } finally {
        //         setSlice({ isLoading: false });
        //     }
        // },

        setAllCustomers: (allCustomers) => setSlice({ allCustomers }),

        setSelectedCustomer: (selectedCustomer) => setSlice({ selectedCustomer }),

        setCustomerForm: ({ name, value }) => {
            const { customerForm } = get().customer;
            setSlice({ customerForm: { ...customerForm, [name]: value }});
        },

        prepopulateCustomerForm: () => {
            const { item } = get().modal;
            setSlice({ customerForm: item });
        },

        resetCustomerForm: () => {
            setSlice({ customerForm: { ...initialCustomerForm } });
        },

        clearSelectedCustomer: () => setSlice({ selectedCustomer: null }),

        setLoading: (loading) => setSlice({ loading })
    }
};