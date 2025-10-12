
import React from "react";
import { ConfirmDeleteModal, CustomerFormModal } from '@components';
import { useStateManager } from '@useStateManager';


export const ModalManager = () => {
    const { modal } = useStateManager();
    if ( !modal )
        return null;
    if( modal.key === 'confirmDelete' )
        return <ConfirmDeleteModal />
    if( modal.key === 'addCustomer' )
        return <CustomerFormModal />
    if( modal.key === 'updateCustomer' )
        return <CustomerFormModal update={true} />
};