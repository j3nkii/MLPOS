import React, { useEffect, useState } from 'react';
import { Button, Input, TableForm } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from '@components';
import { useModalZussy } from '@zussy';
import { useInvoiceQuery, useCustomerQuery } from '@query';
import { useParams } from 'react-router-dom';



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

export const SelectedInvoicePage = ({ isUpdate }) => {
    const params = useParams();
    const { createInvoice, updateInvoice, readAllInvoices } = useInvoiceQuery();
    const { closeModal, setModal } = useModalZussy();
    const { readAllCustomers } = useCustomerQuery();
    const [selectedInvoice, setSelectedInvoice] = useState(INITIAL);
    const [modalTitle] = useState(isUpdate ? 'Update Invoice' : 'Create Invoice');
    const [invoiceForm, setInvoiceForm] = useState(INITIAL);
    const [total, setTotal] = useState(0);


    const displayColumns = headers.map(x => x.display);
    const columnKeys = headers.map(x => x.key);

    useEffect(() => {
        const { invoiceID } = params;
        const invoiceIndex = readAllInvoices?.data?.data.findIndex(x => x.id === invoiceID);
        // setSelectedInvoice(readAllInvoices?.data?.data[invoiceIndex]);
        const selectedInvoice = readAllInvoices?.data?.data[invoiceIndex];
        if(selectedInvoice){
            setInvoiceForm({
                price: selectedInvoice.price,
                customerID: selectedInvoice.customer_id,
                status: selectedInvoice.status,
                details: selectedInvoice.details.map((detail, index) => ({
                    ...detail,
                    // inEdit: false,
                    // isMutated: false,
                    index
                })),
                payments: selectedInvoice.payments
            });
            setSelectedInvoice(selectedInvoice)
        }
        console.log(selectedInvoice)
        console.log(invoiceID)
        console.log(readAllInvoices?.data?.data)
    }, [readAllInvoices?.data?.data]);

    // useEffect(() => {
    //     if(isUpdate){
    //         setInvoiceForm({
    //             price: selectedInvoice.price,
    //             customerID: selectedInvoice.customer_id,
    //             status: selectedInvoice.status,
    //             details: selectedInvoice.details.map((detail, index) => ({
    //                 ...detail,
    //                 // inEdit: false,
    //                 // isMutated: false,
    //                 index
    //             })),
    //             payments: selectedInvoice.payments
    //         });
    //     }
    // }, []);

    useEffect(() => {
        let newTotal = 0;
        invoiceForm.details.forEach(x => newTotal += (x.price * x.quantity));
        setTotal(newTotal)
    }, [invoiceForm]);

    const handleConfirm = async (evt) => {
        evt.preventDefault()
        const handler = isUpdate ? updateInvoice : createInvoice;
        const body = { invoiceID: selectedInvoice?.id, body: invoiceForm }
        handler.mutate(body);
    };

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setInvoiceForm({ ...invoiceForm, [name]: value });
    }

    const setDetails = (details) => {
        setInvoiceForm({ ...invoiceForm, details });
    }

    // const addPayment = () => {
    //     setModal({ modalKey: 'createPayment',});
    // }

    // const editPayment = (selectedPayment) => {
    //     setModal({ modalKey: 'updatePayment', selectedInvoice: { ...selectedInvoice, selectedPayment }});
    // }

    // const deletePayment = (selectedPayment) => {
    //     setModal({ modalKey: 'deletePayment', selectedInvoice: { ...selectedInvoice, selectedPayment }});
    // }

    return (
        <div className='max-w-170 bg-white'>
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
                <Table {...{ displayColumns: paymentHeaders.map(x => x.display), columnKeys: paymentHeaders.map(x => x.key), modalKeys, data: invoiceForm.payments }} />
            </form>
        </div>
    );
}
