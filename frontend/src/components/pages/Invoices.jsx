import React from 'react';
import { Table } from '@components';
import { useStateManager } from '@useStateManager';



export const InvoicesPage = () => {
    
    return (
        <div className='max-w-170'>
            <h1>Invoices:</h1>
            <Table data={'allInvoices'} isManage={true} />
        </div>
    );
};
