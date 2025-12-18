
import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalFooter } from '@components';
import { useState } from '@useState';
import { Button } from '@components';


export const template = () => {
    const { closeModal, modal: { item } } = useState();

    const handleConfirm = async () => {
        console.warn('Something should probably happen');
        console.log(item);
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Confirm'} onClose={closeModal} />
            <div className="p-6">
                <p>This should probably say something</p>
            </div>
            <ModalFooter>
                <Button onClick={handleConfirm}>Delete</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}