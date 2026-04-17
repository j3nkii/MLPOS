import React, { useEffect, useState } from 'react';
import { Button, Input, TableForm } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from '@components';
import { useModalZussy } from '@zussy';
import { useCustomerQuery, useTicketQuery } from '@query';
import { useParams } from 'react-router-dom';


import { Trash2, DiamondPlus, BookUser, Pencil, Send, BadgeJapaneseYen } from 'lucide-react'



const INITIAL = {
    price: '',
    customerID: '',
    status: '',
    details: [],
    payments: [],
};



export const SelectedCustomerPage = () => {
    const params = useParams();
    const { readAllCustomers } = useCustomerQuery();
    const { readAllTickets } = useTicketQuery();
    const [selectedCustomer, setSelectedCustomer] = useState(INITIAL);
    const [customerTickets, setCustomerTickets] = useState([]);
    const { setModal } = useModalZussy();

    useEffect(() => {
        const { customerID } = params;
        const customerIndex = readAllCustomers?.data?.data.findIndex(x => x.id === customerID);
        const selectedCustomer = readAllCustomers?.data?.data[customerIndex];
        if(selectedCustomer){
            setSelectedCustomer(selectedCustomer);
        }
    }, [readAllCustomers?.data?.data]);

    useEffect(() => {
        const { customerID } = params;
        console.log(readAllTickets?.data?.data)
        console.log(readAllTickets?.data)
        const customerTickets = readAllTickets?.data?.data.filter(x => x.customer_id === customerID);
        if(customerTickets){
            setCustomerTickets(customerTickets);
        }
    }, [readAllTickets?.data?.data])

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

    const onSend = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'sendCustomer',
            item: selectedCustomer,
        });
    };

    return (
        <div className='max-w-170 bg-white'>
            <h1 className=' text-4xl font-extrabold'>{selectedCustomer.name}</h1>
            <h1 className=' text-4xl font-extrabold'>{selectedCustomer.email}</h1>
            <h1 className=' text-4xl font-extrabold'>{selectedCustomer.phone}</h1>
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
                    {/* <Button
                        color={'green'}
                        onClick={onSend} 
                        text='Send'
                    ><Send />
                    </Button> */}
                </div>
            </div>
            <Table config={'tickets'} data={customerTickets} />
            {/* <Payments payments={selectedCustomer.payments} total={selectedCustomer.price} /> */}
        </div>
    );
}
