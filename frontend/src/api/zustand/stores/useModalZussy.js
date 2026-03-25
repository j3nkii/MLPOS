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
        const hasKey = modal.hasOwnProperty('modalKey');
        const hasItem = modal.hasOwnProperty('item');
        if(!hasItem || !hasKey){
            if(!hasKey) console.error('MODAL NEEDS KEY');
            if(!hasItem) console.warn('modal may need an item');
            console.warn('modal received ::', modal);
        }
        set(modal);
    },
    closeModal: () => {
        console.warn('this is nuclear, clearing all form state and all modals.');
        set({ modalKey: null, item: null });
    },
}));