
import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalFooter, ModalBody } from '@components';
import { useStateManager } from '@useStateManager';
import { Button } from '@components';


export const ConfirmDeleteModal = () => {
    const { closeModal, modal: { item }, deleteCustomer } = useStateManager();

    const handleConfirm = async () => {
        console.log(item.id)
        deleteCustomer(item.id);
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Confirm'} onClose={closeModal} />
            <ModalBody>
                <div className="p-6">
                    <p>Are you sure you want to delete this person?</p>
                    <p className="text-red-500">{item.name}</p>
                </div>
            </ModalBody>

            <ModalFooter>
                <Button onClick={handleConfirm}>Delete</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}