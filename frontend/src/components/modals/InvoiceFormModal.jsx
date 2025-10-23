import React, { useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModal, useInvoice } from '@useStateManager';
import { Button, Input } from '@components';

export const InvoiceFormModal = ({ update }) => {
    const { invoiceForm } = useInvoice();
    const { setInvoiceForm, createInvoice, prepopulateInvoiceForm, updateInvoice } = useInvoice();
    const { closeModal } = useModal();

    useEffect(() => {
        if(update)
            prepopulateInvoiceForm();
    }, [])

    const handleConfirm = async () => {
        update ? updateInvoice(invoiceForm.id) : createInvoice();
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
                    <Input onChange={handleChange} value={invoiceForm.amount} label={'Amount'} name={'amount'} />
                    <Input onChange={handleChange} value={invoiceForm.customer} label={'customer'} name={'Customer'} />
                </form>
            </ModalBody>

            <ModalFooter>
                <Button onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}