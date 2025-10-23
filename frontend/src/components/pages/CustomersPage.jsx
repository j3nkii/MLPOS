import React, { useEffect } from 'react';
import { useLocation } from 'react-router'
import { Table } from '@components';
import { useCustomer } from '@useStateManager';
export const TABLE_CONFIG = {
    customers: {
        pageTitle: 'Customers',
        listKey: 'readAllCustomers',
        stateKey: 'allCustomers',
        headers: {
            name: 'Name',
            phone: 'Phone',
            email: 'Email',
        },
        modalKeys: {
            update: 'updateCustomer',
            create: 'createCustomer',
            delete: 'confirmDelete',
        },
    },
    invoices: {
        pageTitle: 'Invoices',
        listKey: 'readAllCustomers',
        stateKey: 'allCustomers',
        headers: {
            customer: 'Customer',
            amount: 'Amount',
            status: 'Status',
            dateSent: 'Date Sent'
        },
        modalKeys: {
            update: '',
            create: '',
            delete: '',
        },
    }
}


export const CustomersPage = () => {
    const { allCustomers } = useCustomer();
    const { headers, stateKey, modalKeys } = TABLE_CONFIG['customers'];
    const displayColumns = Object.values(headers);
    const columnKeys = Object.keys(headers);
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-20 text-4xl font-extrabold'>Customers:</h1>
            <Table {...{ displayColumns, columnKeys, stateKey, modalKeys, data: allCustomers }} />
        </div>
    );
};