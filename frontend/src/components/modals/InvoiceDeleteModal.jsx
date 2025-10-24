
import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalFooter, ModalBody } from '@components';
import { useInvoice, useModal } from '@useStateManager';
import { Button } from '@components';


export const InvoiceDeleteModal = () => {
    const { deleteInvoice } = useInvoice();
    const { item } = useModal();
    const {closeModal} = useModal();

    const handleConfirm = async () => {
        console.log(item.id)
        deleteInvoice(item.id);
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Confirm'} onClose={closeModal} />
            <ModalBody>
                <div className="p-6">
                    <p>Are you sure you want to delete this Invoice?</p>
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