
import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalFooter } from '@components';
import { useStateManager } from '@useStateManager';
import { Button, Input } from '@components';


export const AddCustomerModal = () => {
    const { closeModal, modal: { item } } = useStateManager();

    const handleConfirm = async () => {
        console.warn('Something should probably happen');
        console.log(item);
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Confirm'} onClose={closeModal} />
            <form className="p-6">
                <Input label={'Name'} name={'name'} />
                <Input label={'Email'} name={'email'} />
                <Input label={'Phone'} name={'phone'} />
            </form>
            <ModalFooter>
                <Button onClick={handleConfirm}>Delete</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}