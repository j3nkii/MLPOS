const MODAL_TYPES = ['confirmDelete', '']
export const createModalSlice = (set, get) => ({
    modal: null,
    setModal: ( modal ) => {
        const { key, item } = modal;
        if(!MODAL_TYPES.includes(key))
            console.warn(`Modal Type: ${key} : invalid`);
        set({ modal: modal });
    },
    closeModal: () => {
        // as is, this is nuclear.
        const { resetCustomerForm, clearSelectedCustomer } = get();
        clearSelectedCustomer();
        resetCustomerForm();
        set({ modal: null });
    },
});