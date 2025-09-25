
import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalFooter } from '@components';
import { useStateManager } from '@useStateManager';
import { Button, Input } from '@components';


export const AddCustomerModal = () => {
    const { closeModal, modal, addNewCustomerForm, setNewCustomerForm, submitNewCustomer } = useStateManager();

    const handleConfirm = async () => {
        console.warn('Something should probably happen');
        console.log(modal);
        submitNewCustomer()
    };

    const handleChange = (evt) => {
        console.log(evt);
        const { target: {name, value }} = evt;
        setNewCustomerForm({ name, value });
    }

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Confirm'} onClose={closeModal} />
            <form className="p-6">
                <Input onChange={handleChange} value={addNewCustomerForm.name} label={'Name'} name={'name'} />
                <Input onChange={handleChange} value={addNewCustomerForm.email} label={'Email'} name={'email'} />
                <Input onChange={handleChange} value={addNewCustomerForm.phone} label={'Phone'} name={'phone'} />
            </form>
            <ModalFooter>
                <Button onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}