import React from 'react';
import { TableWrapper } from '@components';
import { useStateManager } from '@useStateManager';



export const CustomersPage = () => {
    const { fetchAllCustomers } = useStateManager();
    React.useEffect(() => {
        fetchAllCustomers();
    }, [])
    return (
        <div className='pt-20 max-w-170 bg-white'>
            <h1 className='p-8 text-4xl font-extrabold'>Customers:</h1>
            <TableWrapper configKey={'customers'} isManage={true} />
        </div>
    );
};
