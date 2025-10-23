import React from 'react';
import { Table } from '@components';
import { useInvoice } from '@useStateManager';


const headers = {
    customer: 'Customer',
    amount: 'Amount',
    status: 'Status',
    dateSent: 'Date Sent'
}

const modalKeys = {
    update: 'updateInvoice',
    create: 'createInvoice',
    delete: 'deleteInvoice',
}


export const InvoicesPage = () => {
    const { allInvoices } = useInvoice();
    const displayColumns = Object.values(headers);
    const columnKeys = Object.keys(headers);
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-20 text-4xl font-extrabold'>Invoices:</h1>
            <Table {...{ displayColumns, columnKeys, modalKeys, data: allInvoices }} />
        </div>
    );
};