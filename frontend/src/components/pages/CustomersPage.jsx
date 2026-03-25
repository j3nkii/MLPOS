import React, { useEffect } from 'react';
import { Table, Form } from '@components';
import { useCustomer } from '@zussy';
import { useCustomerQuery } from '@query';


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
    const { readAllCustomers } = useCustomerQuery();
    console.log(readAllCustomers.data)
    const displayColumns = headers.map(x => x.display);
    const columnKeys = headers.map(x => x.key);
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-10 text-4xl font-extrabold'>Customers:</h1>
            <Table {...{ displayColumns, columnKeys, modalKeys, data: readAllCustomers?.data?.data }} />
        </div>
    );
};