import React from 'react';
import { TableHandler } from '@components';
import { useStateManager } from '@useStateManager';



export const InvoicesPage = () => {
    
    return (
        <div className='max-w-170'>
            <h1>Invoices:</h1>
            <TableHandler configKey={'allInvoices'} isManage={true} />
        </div>
    );
};
