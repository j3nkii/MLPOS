import React, { useEffect, useState } from 'react';
import { Button, Input, TableForm } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from '@components';
import { useModalZussy } from '@zussy';
import { useInvoiceQuery, useCustomerQuery } from '@query';
import { useParams } from 'react-router-dom';


const INITIAL = {
    price: '',
    customerID: '',
    status: '',
    details: [],
    payments: [],
};

export const SelectedInvoicePage = ({ isUpdate }) => {
    const params = useParams();
    const { createInvoice, updateInvoice, readAllInvoices } = useInvoiceQuery();
    const { readAllCustomers } = useCustomerQuery();
    const [selectedInvoice, setSelectedInvoice] = useState(INITIAL);
    const [invoiceForm, setInvoiceForm] = useState(INITIAL);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const { invoiceID } = params;
        const invoiceIndex = readAllInvoices?.data?.data.findIndex(x => x.id === invoiceID);
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
                payments: selectedInvoice.payments,
            });
            setSelectedInvoice(selectedInvoice)
        }
    }, [readAllInvoices?.data?.data]);

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

    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-5 pb-2 text-4xl font-extrabold'>Selected Invoice for { selectedInvoice.name}</h1>
            <h2 className='pl-10 pb-5 text-2xl font-bold'>Status {selectedInvoice.status}</h2>
                {/* <Input
                    onChange={handleChange}
                    value={invoiceForm.customerID}
                    label={'Customer'}
                    name={'customerID'}
                    type={'select'}
                    options={readAllCustomers?.data?.data.map(cust => ({ name: cust.name, value: cust.id }))}
                /> */}
                {/* <Input onChange={handleChange} value={invoiceForm.status} label={'Status'} name={'status'} /> */}
                <Table config={'lineItems'} data={invoiceForm.details} />
                <h2 className='pl-15 pb-5 text-xl font-bold'>total: {total}</h2>
                <Table config={'payments'} data={invoiceForm.payments} />
        </div>
    );
}
