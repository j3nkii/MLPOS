import React, { useEffect, useState } from 'react';
import { Button, Input, TableForm } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from '@components';
import { useModalZussy } from '@zussy';
import { useInvoiceQuery, useCustomerQuery } from '@query';
import { useParams } from 'react-router-dom';


import { Trash2, DiamondPlus, BookUser, Pencil, Send, BadgeJapaneseYen } from 'lucide-react'



const INITIAL = {
    price: '',
    customerID: '',
    status: '',
    details: [],
    payments: [],
};



export const SelectedInvoicePage = () => {
    const params = useParams();
    const { readAllInvoices } = useInvoiceQuery();
    const [selectedInvoice, setSelectedInvoice] = useState(INITIAL);
    const { setModal } = useModalZussy();

    useEffect(() => {
        const { invoiceID } = params;
        const invoiceIndex = readAllInvoices?.data?.data.findIndex(x => x.id === invoiceID);
        const selectedInvoice = readAllInvoices?.data?.data[invoiceIndex];
        if(selectedInvoice){
            setSelectedInvoice(selectedInvoice)
        }
    }, [readAllInvoices?.data?.data]);

    const onDelete = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'deleteInvoice',
            item: selectedInvoice,
        });
    };

    const onUpdate = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'updateInvoice',
            item: selectedInvoice,
        });
    };

    const onSend = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'sendInvoice',
            item: selectedInvoice,
        });
    };

    return (
        <div className='max-w-170 bg-white'>
            <div className='flex'>
                <h1 className='p-10 pt-10 text-4xl font-extrabold'>#INV001: {selectedInvoice.name}; {selectedInvoice.status}</h1>
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
                    <Button
                        color={'green'}
                        onClick={onSend} 
                        text='Send'
                    ><Send />
                    </Button>
                </div>
            </div>
            <Table footer={{ total: selectedInvoice.price }} config={'lineItems'} data={selectedInvoice.details} />
            <Payments payments={selectedInvoice.payments} total={selectedInvoice.price} />
        </div>
    );
}





const Payments = ({ payments = [], total = 0 }) => {
    const { setModal } = useModalZussy();
    const balance = total - payments.reduce((sum, p) => sum + p.price, 0);

    const onDelete = (e, item) => {
        e.stopPropagation();
        setModal({
            modalKey: 'deletePayment',
            item,
        });
    };

    const onUpdate = (e, item) => {
        e.stopPropagation();
        setModal({
            modalKey: 'updatePayment',
            item,
        });
    };

    const onCreate = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'createPayment',
            item: { total, balance },
        });
    };

    return (
        <div className='p-5 pt-2 pb-15 overflow-hidden'>
            <div className='flex items-center justify-between px-4 py-2.5 border-b border-gray-200'>
                <span className='text-sm font-medium'>Payments</span>
                <Button
                    text='Add'
                    color='green'
                    onClick={onCreate}
                ><BadgeJapaneseYen/>
                </Button>
            </div>

            {payments.map((payment, i) => (
                <div key={payment.id ?? i} className='flex items-center justify-between px-4 py-2.5 border-b border-gray-200'>
                    <div className='flex items-center gap-2.5'>
                        <span className='text-xs font-bold px-2 py-0.5 rounded-md border-2 border-black bg-white text-black capitalize'>
                            {payment.method}
                        </span>
                        <span className='text-sm text-gray-400'>
                            {new Date(payment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                    <div className='flex items-center gap-3'>
                        <span className={`text-sm font-medium ${payment.price < 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {payment.price < 0 ? '-' : '+'}${Math.abs(payment.price / 100).toFixed(2)}
                        </span>
                        {/* <button className='text-gray-300 hover:text-gray-500 text-xs'>...</button> */}
                        <div className='flex items-center justify-end'>
                            <Button
                                color='yellow'
                                onClick={(e) => onUpdate(e, payment)} 
                                text='Update'
                            ><Pencil size={20} />
                            </Button>
                            <Button
                                color={'red'}
                                onClick={(e) => onDelete(e, payment)} 
                                text='Delete'
                            ><Trash2 size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            {payments.length === 0 && (
                <div className='px-4 py-3 text-sm text-gray-300'>No payments yet</div>
            )}

            <div className='flex items-center justify-between px-4 py-2.5 bg-black rounded-2xl'>
                <span className='text-sm text-white'>Balance</span>
                <span className={`text-sm font-medium ${balance <= 0 ? 'text-green-600' : 'text-white'}`}>
                    ${(balance / 100).toFixed(2)}
                </span>
            </div>
        </div>
    );
};
