import React from 'react';
import { Table } from '@components';
import { useStateManager } from '@useStateManager';



export const CustomersPage = () => {
    const { fetchAllCustomers } = useStateManager();
    React.useEffect(() => {
        fetchAllCustomers();
    }, [])
    return (
        <div className='max-w-170'>
            <h1>Customers:</h1>
            <Table data={'allCustomers'} isManage={true} />
        </div>
    );
};
