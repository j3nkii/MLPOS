import React, { useEffect, useState } from 'react';
import { Button, Input, TableForm } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from '@components';
import { useModalZussy } from '@zussy';
import { useInvoiceQuery, useCustomerQuery } from '@query';



const headers = [
    {
        display: 'Item',
        key: 'name'
    },
    {
        display: 'Amount',
        key: 'price'
    },
    {
        display: 'Quantity',
        key: 'quantity'
    }
];

const INITIAL = {
    price: '',
    customerID: '',
    status: '',
    details: [],
    payments: [],
};

const paymentHeaders = [
    {
        display: 'Price',
        key: 'price'
    },
    {
        display: 'Method',
        key: 'method'
    }
]

const modalKeys = {
    update: 'updatePayment',
    create: 'createPayment',
    delete: 'deletePayment',
}

export const InvoiceFormModal = ({ isUpdate }) => {
    const [modalTitle] = useState(isUpdate ? 'Update Invoice' : 'Create Invoice')
    const [invoiceForm, setInvoiceForm] = useState(INITIAL);
    const [total, setTotal] = useState(0);
    const { createInvoice, updateInvoice } = useInvoiceQuery();
    const { readAllCustomers } = useCustomerQuery();
    const { closeModal, setModal, item } = useModalZussy();


    const displayColumns = headers.map(x => x.display);
    const columnKeys = headers.map(x => x.key);

    useEffect(() => {
        if(isUpdate){
            setInvoiceForm({
                price: item.price,
                customerID: item.customer_id,
                status: item.status,
                details: item.details.map((detail, index) => ({
                    ...detail,
                    // inEdit: false,
                    // isMutated: false,
                    index
                })),
                payments: item.payments
            });
        }
    }, []);

    useEffect(() => {
        let newTotal = 0;
        invoiceForm.details.forEach(x => newTotal += (x.price * x.quantity));
        setTotal(newTotal)
    }, [invoiceForm]);

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

    const setDetails = (details) => {
        setInvoiceForm({ ...invoiceForm, details });
    }

    const addPayment = () => {
        setModal({ modalKey: 'createPayment',});
    }

    const editPayment = (selectedPayment) => {
        setModal({ modalKey: 'updatePayment', item: { ...item, selectedPayment }});
    }

    const deletePayment = (selectedPayment) => {
        setModal({ modalKey: 'deletePayment', item: { ...item, selectedPayment }});
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
                    <TableForm
                        setDetails={setDetails}
                        details={invoiceForm.details}
                        isUpdate={isUpdate}
                        displayColumns={displayColumns}
                        columnKeys={columnKeys}
                    />
                    <div>total: {total}</div>
                    { isUpdate && <Input onChange={handleChange} value={invoiceForm.status} label={'Status'} name={'status'} /> }
                    {/* <Table {...{ displayColumns: paymentHeaders.map(x => x.display), columnKeys: paymentHeaders.map(x => x.key), modalKeys, data: invoiceForm.payments }} /> */}
                    { isUpdate && <Button onClick={addPayment}>Make Payment</Button> }
                    { isUpdate && invoiceForm.payments.map(payment => (
                        <div className='flex justify-center'>
                            <p>PRICE::{payment.price} METHOD::{payment.method}</p>
                            <Button onClick={() => editPayment(payment)}>EDIT</Button>
                            <Button onClick={() => deletePayment(payment)}>DELTE</Button>
                        </div>
                    ))}
                </form>
            </ModalBody>

            <ModalFooter>
                <Button color={'green'} onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}
