
import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalFooter } from '../ModalManager';
import { useStateManager } from '@useStateManager';
// import { useServiceOrchestrator } from '@util/useServiceOrchestrator';
import { Button } from '@components';


export const ConfirmDeleteModal = () => {
    const { closeModal, appState: { modal: { item } } } = useStateManager();
    // const { deleteSource } = useServiceOrchestrator();

    const handleConfirm = async () => {
        // deleteSource(item.id);
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Confirm'} onClose={closeModal} />
            <div className="p-6">
                <p>Are you sure you want to delete this source?</p>
                <p className="text-red-500">{item.name}</p>
            </div>
            <ModalFooter>
                <Button onClick={handleConfirm}>Delete</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}