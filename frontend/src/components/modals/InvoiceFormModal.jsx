import React, { useEffect, useState } from 'react';
import { Button, Input } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModal, useInvoice, useCustomer } from '@useState';
import { useInvoiceActions } from '@actions';


const INITIAL = {
    amount: '',
    customerID: '',
    status: '',
};


export const InvoiceFormModal = ({ update }) => {
    const [invoiceForm, setInvoiceForm] = useState(INITIAL);
    const { createInvoice, updateInvoice } = useInvoiceActions();
    const { allCustomers } = useCustomer();
    const { closeModal, item } = useModal();

    useEffect(() => {
        if(update){
            console.log(item)
            setInvoiceForm({
                amount: item.amount,
                customerID: item.customer_id,
                status: item.status,
            })
        }
    }, [])

    const handleConfirm = async () => {
        update ? updateInvoice(invoiceForm.id, invoiceForm) : createInvoice(invoiceForm);
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
                    <Input onChange={handleChange} value={invoiceForm.customerID} label={'Customer'} name={'customerID'} type={'select'} options={allCustomers.map(cust => ({ name: cust.name, value: cust.id }))} />
                </form>
            </ModalBody>

            <ModalFooter>
                <Button onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}