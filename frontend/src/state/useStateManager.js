
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
            const { customers: { readAllCustomers }} = get();
            readAllCustomers();
        }
        }),
        { name: 'app-store' }
    )
);



export const useAuth = () => useStateManager(state => state.auth);
export const useCustomers = () => useStateManager(state => state.customers);