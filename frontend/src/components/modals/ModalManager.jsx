
import React from "react";
import { ConfirmDeleteModal } from '@components';
import { useStateManager } from '@useStateManager';


export const ModalManager = () => {
    const { modal } = useStateManager();
    if ( !modal )
        return null;
    if( modal.type === 'confirmDelete' )
        return <ConfirmDeleteModal />
    
};