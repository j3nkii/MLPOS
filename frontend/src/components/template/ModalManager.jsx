
import React from "react";
import { ConfirmDeleteModal, CustomerFormModal } from '@components';
import { useStateManager } from '@useStateManager';


export const ModalManager = () => {
    const { modal } = useStateManager();
    if ( !modal )
        return null;
    switch (modal.key) {
        case 'confirmDelete':
            return <ConfirmDeleteModal />
        case 'createCustomer':
            return <CustomerFormModal />
        case 'updateCustomer':
            return <CustomerFormModal update={true} />
        default:
            return null;
    }
};