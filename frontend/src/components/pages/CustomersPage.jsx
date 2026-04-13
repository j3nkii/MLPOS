import 'react';
import { Table } from '@components';
import { useCustomerQuery } from '@query';



export const CustomersPage = () => {
    const { readAllCustomers } = useCustomerQuery();
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-10 text-4xl font-extrabold'>Customers:</h1>
            <Table config={'customers'} data={readAllCustomers?.data?.data} />
        </div>
    );
};