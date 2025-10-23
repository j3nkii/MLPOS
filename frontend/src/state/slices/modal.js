const MODAL_TYPES = ['confirmDelete', 'updateCustomer', 'createCustomer']
export const createModalSlice = (set, get) => {
    const setSlice = (partial) => set(state => ({
        modal: { ...state.modal, ...partial }
    }));
    return {
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
            setSlice(modal);
        },
        closeModal: () => {
            // as is, this is nuclear.
            const { resetCustomerForm, clearSelectedCustomer } = get().customer;
            clearSelectedCustomer();
            resetCustomerForm();
            setSlice({ modalKey: null, item: null });
        },
    }
};