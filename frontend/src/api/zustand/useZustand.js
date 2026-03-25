import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createAuthSlice } from './slices/auth';
import { createCustomerSlice } from './slices/customer';

export { useModalZussy } from './stores/useModalZussy';

const zustandLogger = (storeName, newState, prevState) => {
    // console.groupCollapsed(
    //     `%c🔄 ${storeName} State Changed`,
    //     'color: #7c3aed; font-weight: bold; font-size: 12px; padding: 2px 4px;'
    // );
    // console.log('%cPrevious State:', 'color: #ef4444; font-weight: bold;', prevState);
    // console.log('%cNew State:', 'color: #22c55e; font-weight: bold;', newState);
    // console.groupEnd();
};

// Custom logger middleware
const loggerMiddleware = (config) => (set, get, api) =>
    config(
        (...args) => {
            const prevState = get();
            set(...args);
            const newState = get();
            zustandLogger('app-store', newState, prevState);
        },
        get,
        api
    );

// Wrap with both devtools AND logger
export const useZustand = create(
    devtools(
        loggerMiddleware((set, get, api) => ({
            auth: createAuthSlice(set, get, api),
            customer: createCustomerSlice(set, get, api),
        })),
        { name: 'app-store' }
    )
);


export const useAuth = () => useZustand(state => state.auth);
export const useCustomer = () => useZustand(state => state.customer);
