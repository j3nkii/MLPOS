
// store/index.js
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createUserSlice } from './slices/user';
import { createCustomerSlice } from './slices/customer';
import { createModalSlice } from './slices/modal';










// Main store combining all slices
export const useStateManager = create(
    devtools(
        (set, get, api) => ({
        isLoading: false,
        ...createUserSlice(set, get, api),
        ...createCustomerSlice(set, get, api),
        ...createModalSlice(set, get, api),
        }),
        { name: 'app-store' }
    )
);

// Selective hooks for better performance
// export const useAuth = () => useStore(state => ({
//     user: state.user,
//     isLoading: state.isLoading,
//     error: state.error,
//     loginForm: state.loginForm,
//     isAuthenticated: state.isAuthenticated,
//     fetchUser: state.fetchUser,
//     logout: state.logout,
//     setLoginForm: state.setLoginForm,
// }));

// export const useCustomers = () => useStore(state => ({
//     customers: state.customers,
//     isLoading: state.isLoading,
//     error: state.error,
//     addNewCustomerForm: state.addNewCustomerForm,
//     fetchAllCustomers: state.fetchAllCustomers,
//     submitNewCustomer: state.submitNewCustomer,
//     deleteCustomer: state.deleteCustomer,
//     setNewCustomerForm: state.setNewCustomerForm,
//     resetCustomerForm: state.resetCustomerForm,
// }));

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