
import React from "react";
import { CustomerDeleteModal, CustomerFormModal, InvoiceFormModal, InvoiceDeleteModal } from '@components';
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
        case 'updateInvoice':
            return <InvoiceFormModal update={true} />
        case 'deleteInvoice':
            return <InvoiceDeleteModal />
        default:
            console.warn('INVALID MODAL ::', modalKey)
            return null;
    }
};