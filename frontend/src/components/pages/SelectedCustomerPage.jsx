import { useEffect, useState } from 'react';
import { Button, Table } from '@components';
import { useModalZussy } from '@zussy';
import { useCustomerQuery, useTicketQuery } from '@query';
import { useParams } from 'react-router-dom';


import { Trash2, Pencil } from 'lucide-react'



const INITIAL = {
    price: '',
    customerID: '',
    status: '',
    details: [],
    payments: [],
};



export const SelectedCustomerPage = () => {
    const params = useParams();
    const { customerID } = params;
    const { readCustomer } = useCustomerQuery();
    const { data: selectedCustomer } = readCustomer(customerID);
    const { setModal } = useModalZussy();

    const onDelete = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'deleteCustomer',
            item: selectedCustomer,
        });
    };

    const onUpdate = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'updateCustomer',
            item: selectedCustomer,
        });
    };

    return (
        <div className='max-w-170 bg-white'>
            <h1 className=' text-4xl font-extrabold'>{selectedCustomer?.name}</h1>
            <h1 className=' text-4xl font-extrabold'>{selectedCustomer?.phone}</h1>
            <h1 className=' text-4xl font-extrabold'>{selectedCustomer?.email}</h1>
            <div className='flex'>
                <div className='flex items-center'>
                    <Button
                        color='yellow'
                        onClick={onUpdate} 
                        text='Update'
                    ><Pencil />
                    </Button>
                    <Button
                        color={'red'}
                        onClick={onDelete} 
                        text='Delete'
                    ><Trash2 />
                    </Button>
                </div>
            </div>
            <Table config={'customerTickets'} data={selectedCustomer?.tickets} />
        </div>
    );
}
