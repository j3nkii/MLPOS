
import React from "react";
import { ConfirmDeleteModal, CustomerFormModal } from '@components';
import { useModal } from '@useStateManager';


export const ModalManager = () => {
    const { modalKey } = useModal();
    switch (modalKey) {
        case 'confirmDelete':
            return <ConfirmDeleteModal />
        case 'createCustomer':
            return <CustomerFormModal />
        case 'updateCustomer':
            return <CustomerFormModal update={true} />
        default:
            console.warn('INVALID MODAL ::', modalKey)
            return null;
    }
};