import React from 'react';
import { TableWrapper } from '@components';
import { useStateManager } from '@useStateManager';



export const InvoicesPage = () => {
    
    return (
        <div className='max-w-170'>
            <h1>Invoices:</h1>
            <TableWrapper configKey={'allInvoices'} isManage={true} />
        </div>
    );
};
