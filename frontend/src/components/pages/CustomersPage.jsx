import React, { useEffect } from 'react';
import { Table } from '@components';
import { useCustomer } from '@useState';
import { useCustomerActions } from '@actions';


const headers = [
    {
        display: 'Name',
        key: 'name'
    },
    {
        display: 'Phone',
        key: 'phone'
    },
    {
        display: 'Email',
        key: 'email'
    },
]

const modalKeys = {
    update: 'updateCustomer',
    create: 'createCustomer',
    delete: 'confirmDelete',
}


export const CustomersPage = () => {
    const { readAllCustomers } = useCustomerActions();
    const { allCustomers } = useCustomer();
    const displayColumns = headers.map(x => x.display);
    const columnKeys = headers.map(x => x.key);
    useEffect(() => {
        readAllCustomers();
    }, []);
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-20 text-4xl font-extrabold'>Customers:</h1>
            <Table {...{ displayColumns, columnKeys, modalKeys, data: allCustomers }} />
        </div>
    );
};