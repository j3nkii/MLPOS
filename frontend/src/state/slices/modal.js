const MODAL_TYPES = ['confirmDelete', '']
export const createModalSlice = (set, get) => ({
    modal: null,
    setModal: (modalKey) => {
        if(!MODAL_TYPES.includes(modalKey.type))
            console.warn(`Modal Type: ${modalKey} : invalid`);
        set({ modal: modalKey })
    },
    closeModal: () => {
        // as is, this is nuclear.
        const { resetCustomerForm, clearSelectedCustomer } = get();
        clearSelectedCustomer();
        resetCustomerForm();
        set({ modal: null });
    },
});