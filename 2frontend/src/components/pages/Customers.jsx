import React from 'react';
import { Button, Input, Table } from '@components';
import { useStateManager } from '@useStateManager';



export const CustomersPage = () => {
    const { fetchCustomers } = useStateManager();
    React.useEffect(() => {
        fetchCustomers();
    }, [])
    return (
        <div>
            <Table data={'customers'} isManage={true} />
        </div>
    );
};
