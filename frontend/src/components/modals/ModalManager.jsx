
import React from "react";
import { X, AlertTriangle } from 'lucide-react';
import { Button, ConfirmDeleteModal } from '@components';
import { useStateManager } from '@useStateManager';


export const ModalManager = () => {
    const { modal } = useStateManager();
    React.useEffect(() => {
        console.log('HEY IM A MODAL MANAGER')
    console.log(modal)

    }, [modal])
    if ( !modal )
        return null;
    if( modal.type === 'confirmDelete' )
        return <ConfirmDeleteModal />
    
};