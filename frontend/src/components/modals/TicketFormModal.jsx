import React, { useEffect, useState } from 'react';
import { Button, Input, TableForm } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from '@components';
import { useModalZussy } from '@zussy';
import { useTicketQuery, useCustomerQuery } from '@query';


const INITIAL = {
    customerID: '',
    status: '',
};

export const TicketFormModal = ({ isUpdate }) => {
    const [modalTitle] = useState(isUpdate ? 'Update Ticket' : 'Create Ticket')
    const [ticketForm, setTicketForm] = useState(INITIAL);
    const { createTicket, updateTicket } = useTicketQuery();
    const { readAllCustomers } = useCustomerQuery();
    const { closeModal, item } = useModalZussy();

    useEffect(() => {
        if(isUpdate){
            setTicketForm({
                customerID: item.customer_id,
                status: item.status,
            });
        }
    }, []);

    const handleConfirm = async (evt) => {
        evt.preventDefault()
        const handler = isUpdate ? updateTicket : createTicket;
        const body = { ticketID: item?.id, body: ticketForm }
        handler.mutate(body);
    };

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setTicketForm({ ...ticketForm, [name]: value });
    }

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={modalTitle} onClose={closeModal} />
            <ModalBody>
                <form onSubmit={handleConfirm} className='p-6'>
                    <Input
                        onChange={handleChange}
                        value={ticketForm.customerID}
                        label={'Customer'}
                        name={'customerID'}
                        type={'select'}
                        options={readAllCustomers?.data?.data.map(cust => ({ name: cust.name, value: cust.id }))}
                    />
                    { isUpdate && <Input onChange={handleChange} value={ticketForm.status} label={'Status'} name={'status'} /> }
                </form>
            </ModalBody>

            <ModalFooter>
                <Button color={'green'} onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}
