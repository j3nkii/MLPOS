import React from 'react';
import { Button, Input, Table } from '@components';
import { useStateManager } from '@useStateManager';



export const CustomersPage = () => {
    const { fetchCustomers } = useStateManager();
    React.useEffect(() => {
        console.log('useEffect CUSTOEMRS')
        fetchCustomers();
    }, [])
    return (
        <div>
            <Table data={'customers'} />
        </div>
    );
};
