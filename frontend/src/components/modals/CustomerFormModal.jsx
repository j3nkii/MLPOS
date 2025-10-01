
import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalFooter } from '@components';
import { useStateManager } from '@useStateManager';
import { Button, Input } from '@components';

export const CustomerFormModal = ({ update }) => {
    const { customerForm } = useStateManager();
    const { closeModal, setCustomerForm, submitNewCustomer, prepopulateCustomerForm, resetCustomerForm, updateCustomer } = useStateManager();

    useEffect(() => {
        if(update)
            prepopulateCustomerForm();
    }, [])

    const handleConfirm = async () => {
        update ? updateCustomer(customerForm.id) : submitNewCustomer();
    };

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setCustomerForm({ name, value });
    }

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Confirm'} onClose={closeModal} />
            <form className="p-6">
                <Input onChange={handleChange} value={customerForm.name} label={'Name'} name={'name'} />
                <Input onChange={handleChange} value={customerForm.email} label={'Email'} name={'email'} />
                <Input onChange={handleChange} value={customerForm.phone} label={'Phone'} name={'phone'} />
            </form>
            <ModalFooter>
                <Button onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}