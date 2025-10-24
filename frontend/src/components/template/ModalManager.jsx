
import React from "react";
import { CustomerDeleteModal, CustomerFormModal, InvoiceFormModal } from '@components';
import { useModal } from '@useStateManager';


export const ModalManager = () => {
    const { modalKey } = useModal();
    switch (modalKey) {
        case 'confirmDelete':
            return <CustomerDeleteModal />
        case 'createCustomer':
            return <CustomerFormModal />
        case 'updateCustomer':
            return <CustomerFormModal update={true} />
        case 'createInvoice':
            return <InvoiceFormModal />
        default:
            console.warn('INVALID MODAL ::', modalKey)
            return null;
    }
};