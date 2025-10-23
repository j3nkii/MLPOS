
import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useCustomers } from '@useStateManager';
import { Button, Input } from '@components';

export const CustomerFormModal = ({ update }) => {
    const { customerForm } = useCustomers();
    const { closeModal, setCustomerForm, createCustomer, prepopulateCustomerForm, resetCustomerForm, updateCustomer } = useCustomers();

    useEffect(() => {
        if(update)
            prepopulateCustomerForm();
    }, [])

    const handleConfirm = async () => {
        update ? updateCustomer(customerForm.id) : createCustomer();
    };

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setCustomerForm({ name, value });
    }

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Confirm'} onClose={closeModal} />
            <ModalBody>
                <form className="p-6">
                    <Input onChange={handleChange} value={customerForm.name} label={'Name'} name={'name'} />
                    <Input onChange={handleChange} value={customerForm.email} label={'Email'} name={'email'} />
                    <Input onChange={handleChange} value={customerForm.phone} label={'Phone'} name={'phone'} />
                </form>
            </ModalBody>

            <ModalFooter>
                <Button onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}