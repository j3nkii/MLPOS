import React, { useEffect, useState } from 'react';
import { Button, Input, TableForm } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from '@components';
import { useModalZussy } from '@zussy';
import { useInvoiceQuery, useCustomerQuery } from '@query';


const INITIAL = {
    customerID: '',
    status: '',
};

export const InvoiceFormModal = ({ isUpdate }) => {
    const [modalTitle] = useState(isUpdate ? 'Update Invoice' : 'Create Invoice')
    const [invoiceForm, setInvoiceForm] = useState(INITIAL);
    const { createInvoice, updateInvoice } = useInvoiceQuery();
    const { readAllCustomers } = useCustomerQuery();
    const { closeModal, item } = useModalZussy();

    useEffect(() => {
        if(isUpdate){
            setInvoiceForm({
                customerID: item.customer_id,
                status: item.status,
            });
        }
    }, []);

    const handleConfirm = async (evt) => {
        evt.preventDefault()
        const handler = isUpdate ? updateInvoice : createInvoice;
        const body = { invoiceID: item?.id, body: invoiceForm }
        handler.mutate(body);
    };

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setInvoiceForm({ ...invoiceForm, [name]: value });
    }

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={modalTitle} onClose={closeModal} />
            <ModalBody>
                <form onSubmit={handleConfirm} className='p-6'>
                    <Input
                        onChange={handleChange}
                        value={invoiceForm.customerID}
                        label={'Customer'}
                        name={'customerID'}
                        type={'select'}
                        options={readAllCustomers?.data?.data.map(cust => ({ name: cust.name, value: cust.id }))}
                    />
                    { isUpdate && <Input onChange={handleChange} value={invoiceForm.status} label={'Status'} name={'status'} /> }
                </form>
            </ModalBody>

            <ModalFooter>
                <Button color={'green'} onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}
