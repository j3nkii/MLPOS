
import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalFooter, ModalBody } from '@components';
import { useModal } from '@useZustand';
import { useCustomerQuery } from '@query';
import { Button } from '@components';


export const CustomerDeleteModal = () => {
    const { deleteCustomer } = useCustomerQuery();
    const { item } = useModal();
    const {closeModal} = useModal();

    const handleConfirm = async () => {
        deleteCustomer.mutate(item.id);
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