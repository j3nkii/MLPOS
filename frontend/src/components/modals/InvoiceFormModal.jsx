import React, { useEffect, useState } from 'react';
import { Button, Input, TableForm } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy } from '@zussy';
import { useInvoiceQuery, useCustomerQuery } from '@query';



const headers = [
    {
        display: 'Item',
        key: 'name'
    },
    {
        display: 'Amount',
        key: 'amount'
    }
];




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


    const displayColumns = headers.map(x => x.display);
    const columnKeys = headers.map(x => x.key);

    useEffect(() => {
        if(update){
            setInvoiceForm({
                amount: item.amount,
                customerID: item.customer_id,
                status: item.status,
            })
        }
    }, [])

    const handleConfirm = async (evt) => {
        evt.preventDefault()
        console.log('###CONFIRM')
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
                <form onSubmit={handleConfirm} className="p-6">
                    <Input onChange={handleChange} value={invoiceForm.amount} label={'Amount'} name={'amount'} />
                    { update && <Input onChange={handleChange} value={invoiceForm.status} label={'Status'} name={'status'} /> }
                    <Input onChange={handleChange} value={invoiceForm.customerID} label={'Customer'} name={'customerID'} type={'select'} options={readAllCustomers?.data?.data.map(cust => ({ name: cust.name, value: cust.id }))} />
                    <TableForm {...{ displayColumns, columnKeys }} />
                </form>
            </ModalBody>

            <ModalFooter>
                <Button onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}