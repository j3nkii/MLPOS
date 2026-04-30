
import React, { useEffect, useState,  useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy} from '@zussy';
import { Button, Input } from '@components';

import { useTicketQuery, useProductQuery } from '@query';

import { useParams } from 'react-router-dom';

const INITIAL_FORM = {
    name: '',
    price: 0,
    quantity: 1,
    useExisting: true,
};

export const TicketItemFormModal = ({ isUpdate }) => {
    const nameRef = useRef()
    const params = useParams();
    const [modalTitle] = useState(isUpdate ? 'Update Ticket Item' : 'Create Ticket Item');
    const [ticketItemForm, setTicketItemForm] = useState(INITIAL_FORM);
    const { createTicketItem, updateTicketItem } = useTicketQuery();
    const { readAllProducts } = useProductQuery();
    const { setModal, item, closeModal  } = useModalZussy();

    useEffect(() => {
        nameRef?.current?.focus()
        if(isUpdate){
            setTicketItemForm({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                useExisting: true,
            });
        }
    }, [nameRef]);

    useEffect(() => {
        
    }, [ticketItemForm]);

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
        const { target: { name, value, type, checked }} = evt;
        const isCheckbox = type === 'checkbox';
        setTicketItemForm({ ...ticketItemForm, [name]: isCheckbox ? checked : value });
    }

    const handleSelectChange = (evt) => {
        const { target: { value }} = evt;
        const selectedOption = evt.target.options[evt.target.selectedIndex];
        console.log(selectedOption.dataset)
        const data = JSON.parse(selectedOption.dataset.meta);
        setTicketItemForm({ ...ticketItemForm, name: value, price: data.price });
    }

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={modalTitle} onClose={closeModal} />
            <ModalBody>
                <form className='p-6'>
                    <Input type={'checkbox'} onChange={handleChange} value={ticketItemForm.useExisting} label={'Use Existing Item'} name={'useExisting'} />
                    { ticketItemForm.useExisting ?
                        <Input type='select' options={readAllProducts?.data?.data} onSubmit={saveAndNext} onChange={handleSelectChange} value={ticketItemForm.name || ''} label={'Name'} name={'name'} />
                    :
                        <Input onSubmit={saveAndNext} ref={nameRef} onChange={handleChange} value={ticketItemForm.name || ''} label={'Name'} name={'name'} />
                    }
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