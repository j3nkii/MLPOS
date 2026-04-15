
import React, { useEffect, useState,  useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy} from '@zussy';
import { Button, Input } from '@components';

import { useTicketQuery } from '@query';

import { useParams } from 'react-router-dom';

const INITIAL_FORM = {
    name: '',
    price: 0,
    quantity: 1,
};

export const TicketItemFormModal = ({ isUpdate }) => {
    const nameRef = useRef()
    const params = useParams();
    const [modalTitle] = useState(isUpdate ? 'Update Ticket Item' : 'Create Ticket Item');
    const [ticketItemForm, setTicketItemForm] = useState(INITIAL_FORM);
    const { createTicketItem, updateTicketItem } = useTicketQuery();
    const { setModal, item, closeModal  } = useModalZussy();

    useEffect(() => {
        nameRef?.current.focus()
        if(isUpdate){
            setTicketItemForm({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            });
        }
    }, [nameRef]);

    const handleConfirm = async (evt, isNext) => {
        evt.preventDefault();
        const payload = { ticketID: params.ticketID, ticketItemID: item?.id, body: ticketItemForm }
        const handleFn = isUpdate ? updateTicketItem : createTicketItem;
        handleFn.mutate(payload);
        if(isNext)return;
        closeModal();
    };

    const saveAndNext = (evt) => {
        evt.preventDefault();
        handleConfirm(evt, true);
        setTicketItemForm(INITIAL_FORM);
        nameRef?.current.focus()
    }

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setTicketItemForm({ ...ticketItemForm, [name]: value });
    }

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={modalTitle} onClose={closeModal} />
            <ModalBody>
                <form className='p-6'>
                    <Input onSubmit={saveAndNext} ref={nameRef} onChange={handleChange} value={ticketItemForm.name || ''} label={'Name'} name={'name'} />
                    <Input type={'number'} onChange={handleChange} value={ticketItemForm.price || ''} label={'Price'} name={'price'} />
                    <Input type={'number'} onChange={handleChange} value={ticketItemForm.quantity || ''} label={'Quantity'} name={'quantity'} />
                    <button onClick={saveAndNext} type='submit' style={{ display: 'none' }}></button>
                </form>
            </ModalBody>

            <ModalFooter>
                <Button color={'green'} onClick={saveAndNext}>Create&Next</Button>
                <Button color={'black'} onClick={handleConfirm}>Create&Close</Button>
            </ModalFooter>
        </Modal>
    );
}