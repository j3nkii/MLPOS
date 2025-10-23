
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
        auth: createAuthSlice(set, get, api),
        customer: createCustomerSlice(set, get, api),
        modal: createModalSlice(set, get, api),
        // ...createInvoicesSlice(set, get, api),
        general: {
            isLoading: false,
            initApplication: () => {
                console.log('$init applicaiton$')
                const { readAllCustomers } = get().customer;
                readAllCustomers();
            }
        },
        }),
        { name: 'app-store' }
    )
);



export const useAuth = () => useStateManager(state => state.auth);
export const useCustomer = () => useStateManager(state => state.customer);
export const useModal = () => useStateManager(state => state.modal);