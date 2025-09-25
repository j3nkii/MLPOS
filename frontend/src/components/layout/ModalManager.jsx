
import React from "react";
import { ConfirmDeleteModal, AddCustomerModal } from '@components';
import { useStateManager } from '@useStateManager';


export const ModalManager = () => {
    const { modal } = useStateManager();
    if ( !modal )
        return null;
    if( modal.type === 'confirmDelete' )
        return <ConfirmDeleteModal />
    if( modal === 'addCustomer' )
        return <AddCustomerModal />
    
};