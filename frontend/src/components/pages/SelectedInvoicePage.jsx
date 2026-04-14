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
            <Payments payments={invoiceForm.payments} total={selectedInvoice.price} />

        </div>
    );
}


const Payments = ({ payments = [], total = 0 }) => {
    const balance = total - payments.reduce((sum, p) => sum + p.price, 0);

    return (
        <div className='p-5 pt-2 pb-15 overflow-hidden'>
            <div className='flex items-center justify-between px-4 py-2.5 border-b border-gray-200'>
                <span className='text-sm font-medium'>Payments</span>
                <Button text='Add' color='green'>ADD PAYMENT</Button>
            </div>

            {payments.map((payment, i) => (
                <div key={payment.id ?? i} className='flex items-center justify-between px-4 py-2.5 border-b border-gray-200'>
                    <div className='flex items-center gap-2.5'>
                        <span className='text-xs px-2 py-0.5 rounded-md border border-black bg-black text-white capitalize'>
                            {payment.method}
                        </span>
                        <span className='text-sm text-gray-400'>
                            {new Date(payment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <span className={`text-sm font-medium ${payment.price < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {payment.price < 0 ? '-' : '+'}${Math.abs(payment.price / 100).toFixed(2)}
                        </span>
                        <button className='text-gray-300 hover:text-gray-500 text-xs'>...</button>
                    </div>
                </div>
            ))}

            {payments.length === 0 && (
                <div className='px-4 py-3 text-sm text-gray-300'>No payments yet</div>
            )}

            <div className='flex items-center justify-between px-4 py-2.5 bg-black rounded-2xl'>
                <span className='text-sm text-white'>Balance</span>
                <span className={`text-sm font-medium ${balance <= 0 ? 'text-green-600' : 'text-white'}`}>
                    ${(balance / 100).toFixed(2)}
                </span>
            </div>
        </div>
    );
};
