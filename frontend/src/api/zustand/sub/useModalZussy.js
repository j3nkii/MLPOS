import { create } from 'zustand';


export const MODAL_TYPES = {
    CONFIRM_DELETE: 'confirmDelete',
    UPDATE_CUSTOMER: 'updateCustomer',
    CREATE_CUSTOMER: 'createCustomer',
}

export const useModalZussy = create((set, get) => ({
    modalKey: null,
    item: null,
    setModal: ( modal ) => {
        set(modal);
    },
    closeModal: () => {
        set({ modalKey: null, item: null });
    },
}));