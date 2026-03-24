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

        setAllCustomers: (allCustomers) => setSlice({ allCustomers }),

        setSelectedCustomer: (selectedCustomer) => setSlice({ selectedCustomer }),

        setCustomerForm: ({ name, value }) => {
            const { customerForm } = get().customer;
            setSlice({ customerForm: { ...customerForm, [name]: value }});
        },

        // prepopulateCustomerForm: () => {
        //     const { item } = get().modal;
        //     setSlice({ customerForm: item });
        // },

        resetCustomerForm: () => {
            setSlice({ customerForm: { ...initialCustomerForm } });
        },

        clearSelectedCustomer: () => setSlice({ selectedCustomer: null }),

        setLoading: (loading) => setSlice({ loading })
    }
};