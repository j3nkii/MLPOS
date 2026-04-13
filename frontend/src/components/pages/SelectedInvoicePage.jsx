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


    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-5 pb-2 text-4xl font-extrabold'>Invoice:</h1>
            <Table footer={{ total }} config={'lineItems'} data={invoiceForm.details} />
            <h1 className='p-10 pt-5 pb-2 text-4xl font-extrabold'>Payments:</h1>
            <Table config={'payments'} data={invoiceForm.payments} />
        </div>
    );
}
