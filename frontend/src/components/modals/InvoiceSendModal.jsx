
import React, { useEffect, useState,  useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useInvoiceQuery } from '@query';
import { useModalZussy} from '@zussy';
import { Button, Input } from '@components';
import { useParams } from 'react-router-dom';


export const InvoiceSendModal = ({ isUpdate }) => {
    const params = useParams();
    const { createInvoiceItem, updateInvoiceItem, createInvoiceSend } = useInvoiceQuery();
    const { item, closeModal  } = useModalZussy();

    const handleConfirm = async () => {
        const payload = { invoiceID: params.invoiceID }
        createInvoiceSend.mutate(payload);
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Send Invoice'} onClose={closeModal} />
            <ModalBody>
                <div className=' p-3 bg-white'>
                    <h1 className='p-3 text-4xl bg-white font-extrabold'>#INV001</h1>
                    <h1 className='p-3 text-4xl bg-white font-extrabold'>{item.name}</h1>
                    <h1 className='p-3 text-4xl bg-white font-extrabold'>{item.status}</h1>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color={'green'} onClick={handleConfirm}>Send</Button>
                <Button color={'black'} onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}