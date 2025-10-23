import React from 'react';
import { Table } from '@components';
import { useCustomer } from '@useStateManager';


const headers = {
    name: 'Name',
    phone: 'Phone',
    email: 'Email',
}
const modalKeys = {
    update: 'updateCustomer',
    create: 'createCustomer',
    delete: 'confirmDelete',
}


export const CustomersPage = () => {
    const { allCustomers } = useCustomer();
    const displayColumns = Object.values(headers);
    const columnKeys = Object.keys(headers);
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-20 text-4xl font-extrabold'>Customers:</h1>
            <Table {...{ displayColumns, columnKeys, modalKeys, data: allCustomers }} />
        </div>
    );
};