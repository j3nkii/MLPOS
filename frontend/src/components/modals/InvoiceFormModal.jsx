import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModal, useInvoice } from '@useStateManager';
import { Button, Input } from '@components';

export const InvoiceFormModal = ({ update }) => {
    const { customerForm } = useInvoice();
    const { setInvoiceForm, createInvoice, prepopulateInvoiceForm, updateInvoice } = useInvoice();
    const { closeModal } = useModal();

    useEffect(() => {
        if(update)
            prepopulateInvoiceForm();
    }, [])

    const handleConfirm = async () => {
        update ? updateInvoice(customerForm.id) : createInvoice();
    };

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setInvoiceForm({ name, value });
    }

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Confirm'} onClose={closeModal} />
            <ModalBody>
                <form className="p-6">
                    <Input onChange={handleChange} value={customerForm.amount} label={'Amount'} name={'amount'} />
                    <Input onChange={handleChange} value={customerForm.customer} label={'customer'} name={'Customer'} />
                </form>
            </ModalBody>

            <ModalFooter>
                <Button onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}