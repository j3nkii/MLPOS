import React, { useEffect, useState } from 'react';
import { Button, Input } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy } from '@zussy';
import { useInvoiceQuery, useCustomerQuery } from '@query';


const INITIAL = {
    amount: '',
    customerID: '',
    status: '',
};


export const InvoiceFormModal = ({ update }) => {
    const [invoiceForm, setInvoiceForm] = useState(INITIAL);
    const { createInvoice, updateInvoice } = useInvoiceQuery();
    const { readAllCustomers } = useCustomerQuery();
    const { closeModal, item } = useModalZussy();

    useEffect(() => {
        if(update){
            setInvoiceForm({
                amount: item.amount,
                customerID: item.customer_id,
                status: item.status,
            })
        }
    }, [])

    const handleConfirm = async () => {
        const handler = update ? updateInvoice : createInvoice;
        const body = { invoiceID: item?.id, body: invoiceForm }
        handler.mutate(body);
    };

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setInvoiceForm({ ...invoiceForm, [name]: value });
    }

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Confirm'} onClose={closeModal} />
            <ModalBody>
                <form className="p-6">
                    <Input onChange={handleChange} value={invoiceForm.amount} label={'Amount'} name={'amount'} />
                    { update && <Input onChange={handleChange} value={invoiceForm.status} label={'Status'} name={'status'} /> }
                    <Input onChange={handleChange} value={invoiceForm.customerID} label={'Customer'} name={'customerID'} type={'select'} options={readAllCustomers?.data?.data.map(cust => ({ name: cust.name, value: cust.id }))} />
                </form>
            </ModalBody>

            <ModalFooter>
                <Button onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}