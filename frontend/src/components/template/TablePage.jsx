import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router'
import { TableHandler, Table } from '@components';
import { useStateManager } from '@useStateManager';
import { TABLE_CONFIG } from '@config/tableConfig'


// export const CONFIGURATION = {
//     customers: {
//         pageTitle: 'Customers',
//         listKey: 'fetchAllCustomers',
//         stateKey: 'allCustomers',
//         // columnKeys: [],
//         // columnHeaders: [],
//         headers: {
//             name: 'Name',
//             phone: 'Phone',
//             email: 'Email',
//         },
//         modalKeys: {
//             update: 'updateCustomer',
//             create: 'createCustomer',
//             delete: 'confirmDelete',
//         },
//     },
//     allInvoices: {
//         headers: {
//             customer: 'Customer',
//             amount: 'Amount',
//             status: 'Status'
//         },
//         modalKeys: {
//             update: '',
//             create: '',
//             delete: '',
//         },
//     }
// }



export const TablePage = () => {
    const location = useLocation();
    const configKey = location.pathname.slice(1);
    if(!TABLE_CONFIG[configKey])
        return null;
    const appState = useStateManager(store => store);
    const { pageTitle, headers, listKey, stateKey, modalKeys } = TABLE_CONFIG[configKey];
    const displayColumns = Object.values(headers);
    const columnKeys = Object.keys(headers);
    useEffect(() => {
        appState[listKey]();
    }, []);
    return (
        <div className='pt-20 max-w-170 bg-white'>
            <h1 className='p-8 text-4xl font-extrabold'>{pageTitle}:</h1>
            <Table {...{ displayColumns, columnKeys, stateKey, modalKeys, data: appState[stateKey] }} />
        </div>
    );
};