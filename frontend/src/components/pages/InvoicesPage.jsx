import React, { useEffect } from 'react';
import { Table } from '@components';
import { useInvoice } from '@useState';
import { useInvoiceActions } from '@actions';


const headers = [
    {
        display: 'Customer',
        key: 'name'
    },
    {
        display: 'Amount',
        key: 'amount'
    },
    {
        display: 'Status',
        key: 'status'
    },
    {
        display: 'Date Sent',
        key: 'created_at'
    }
];

const modalKeys = {
    update: 'updateInvoice',
    create: 'createInvoice',
    delete: 'deleteInvoice',
}


export const InvoicesPage = () => {
    const { readAllInvoices } = useInvoiceActions();
    const { allInvoices } = useInvoice();
    const displayColumns = headers.map(x => x.display);
    const columnKeys = headers.map(x => x.key);
    useEffect(() => {
        readAllInvoices();
    }, []);
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-20 text-4xl font-extrabold'>Invoices:</h1>
            <Table {...{ displayColumns, columnKeys, modalKeys, data: allInvoices }} />
        </div>
    );
};