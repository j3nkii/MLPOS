import { create } from 'zustand';

const TOASTS_TEST = [
    {
        title: 'ERROR',
        message: 'This is an Error.',
        variant: 'error',
    },
    {
        title: 'SUCCESS',
        message: 'This is a Success.',
        variant: 'success'
    },
    {
        title: 'INFO',
        message: 'This is an Info.',
        variant: 'info'
    },
    {
        title: 'WARNING',
        message: 'This is a Warning.',
        variant: 'warning'
    },
]

const reIndex = (x, i) => ({ ...x, index: i});

export const useToastZussy = create((set, get) => ({
    toasts: TOASTS_TEST,
    addToast: (toast) => {
        const copy = [ ...get().toasts ]
        copy.push(toast);
        set({ toasts: copy.map(reIndex) });
    },
    dismissToast: (toast) => {
        const copy = [ ...get().toasts ]
        copy.splice(toast.index, 1);
        set({ toasts: copy.map(reIndex) });
    },
}));