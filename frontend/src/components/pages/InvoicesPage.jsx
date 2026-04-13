import React, { useEffect } from 'react';
import { Table } from '@components';
import { useInvoiceQuery } from '@query';


const headers = [
    {
        display: 'Customer',
        key: 'name'
    },
    {
        display: 'Amount',
        key: 'price'
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
    // update: 'updateInvoice',
    create: 'createInvoice',
    delete: 'deleteInvoice',
    detail: '/invoices/'
}


export const InvoicesPage = () => {
    const { readAllInvoices } = useInvoiceQuery();
    const displayColumns = headers.map(x => x.display);
    const columnKeys = headers.map(x => x.key);
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-10 text-4xl font-extrabold'>Invoices:</h1>
            <Table {...{ displayColumns, columnKeys, modalKeys, data: readAllInvoices?.data?.data }} />
        </div>
    );
};