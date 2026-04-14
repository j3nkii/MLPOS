import 'react';
import { Table } from '@components';
import { useInvoiceQuery } from '@query';



export const InvoicesPage = () => {
    const { readAllInvoices } = useInvoiceQuery();
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-10 text-4xl font-extrabold no-wrap'>Invoices:</h1>
            <Table config={'invoices'} data={readAllInvoices?.data?.data} />
        </div>
    );
};