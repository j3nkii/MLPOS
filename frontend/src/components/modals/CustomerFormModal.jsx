
import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useCustomer, useModal } from '@useStateManager';
import { Button, Input } from '@components';

import { useCustomerActions } from '../../actions/useCustomerActions';

const INITIAL_FORM = {
    name: '',
    phone: '',
    email: '',
};

export const CustomerFormModal = ({ update }) => {
    const [customerForm, setCustomerForm] = useState(INITIAL_FORM);
    // const { customerForm } = useCustomer();
    const { createCustomer, prepopulateCustomerForm, updateCustomer } = useCustomerActions();
    const { closeModal } = useModal();

    useEffect(() => {
        if(update)
            prepopulateCustomerForm();
    }, [])

    const handleConfirm = async () => {
        update ? updateCustomer(customerForm.id) : createCustomer(customerForm);
    };

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setCustomerForm({ ...customerForm, [name]: value });
    }

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Confirm'} onClose={closeModal} />
            <ModalBody>
                <form className="p-6">
                    <Input onChange={handleChange} value={customerForm.name || ''} label={'Name'} name={'name'} />
                    <Input onChange={handleChange} value={customerForm.email || ''} label={'Email'} name={'email'} />
                    <Input onChange={handleChange} value={customerForm.phone || ''} label={'Phone'} name={'phone'} />
                </form>
            </ModalBody>

            <ModalFooter>
                <Button onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}