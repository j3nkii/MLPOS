import { devtools } from 'zustand/middleware';

export { useModalZussy } from './sub/useModalZussy';
export { useAuthZussy } from './sub/useAuthZussy';



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
