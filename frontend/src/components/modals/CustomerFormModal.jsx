
import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy} from '@zussy';
import { Button, Input } from '@components';

import { useCustomerQuery } from '@query';

const INITIAL_FORM = {
    name: '',
    phone: '',
    email: '',
};

export const CustomerFormModal = ({ update }) => {
    const [customerForm, setCustomerForm] = useState(INITIAL_FORM);
    const { createCustomer, updateCustomer } = useCustomerQuery();
    const { closeModal, item } = useModalZussy();

    useEffect(() => {
        if(update){
            setCustomerForm({
                name: item.name,
                phone: item.phone,
                email: item.email,
            })
        }
    }, [])

    const handleConfirm = async () => {
        const payload = { customerID: item?.id, body: customerForm }
        const handleFn = update ? updateCustomer : createCustomer;
        handleFn.mutate(payload);
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