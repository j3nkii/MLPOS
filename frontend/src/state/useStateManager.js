
// store/index.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createAuthSlice } from './slices/auth';
import { createCustomerSlice } from './slices/customer';
import { createModalSlice } from './slices/modal';
import { createInvoicesSlice } from './slices/invoices';



// Main store combining all slices
export const useStateManager = create(
    devtools(
        (set, get, api) => ({
        isLoading: false,
        auth: createAuthSlice(set, get, api),
        customers: createCustomerSlice(set, get, api),
        ...createModalSlice(set, get, api),
        ...createInvoicesSlice(set, get, api),
        initApplication: () => {
            console.log('init applicaiton')
            const { customers: { fetchAllCustomers }} = get();
            fetchAllCustomers();
        }
        }),
        { name: 'app-store' }
    )
);



export const useAuth = () => useStateManager(state => state.auth);
export const useCustomers = () => useStateManager(state => state.customers);



// export const useCustomers = () => useStateManager(state => ({
//     customers: state.customers,
//     isLoading: state.isLoading,
//     error: state.error,
//     customerForm: state.customerForm,
//     fetchAllCustomers: state.fetchAllCustomers,
//     submitNewCustomer: state.submitNewCustomer,
//     deleteCustomer: state.deleteCustomer,
//     setCustomerForm: state.setCustomerForm,
//     resetCustomerForm: state.resetCustomerForm,
// }));











// Selective hooks for better performance

// export const useUI = () => useStore(state => ({
//     modal: state.modal,
//     notifications: state.notifications,
//     setModal: state.setModal,
//     closeModal: state.closeModal,
//     addNotification: state.addNotification,
//     removeNotification: state.removeNotification,
// }));

// export const useActions = () => useStore(state => ({
//     resetCustomerForm: state.resetCustomerForm,
//     submitNewCustomer: state.submitNewCustomer,
//     deleteCustomer: state.deleteCustomer,
// }))