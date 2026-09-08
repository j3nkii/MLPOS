import React, { useState, useEffect } from 'react';
import { Button, Input } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy } from '@zussy';
import { useAppointmentQuery, useCustomerQuery, useTicketQuery } from '@query';



const INITIAL = {
    book_start: '',
    book_end: '',
};

export const AppointmentFormModal = ({ isUpdate }) => {
    const [form, setForm] = useState(INITIAL);
    const { createAppointment, updateAppointment } = useAppointmentQuery();
    const { readAllTickets } = useTicketQuery();
    const { readAllCustomers } = useCustomerQuery();
    const { closeModal, item } = useModalZussy();

    useEffect(() => {
        if(isUpdate){
            setForm({
                id: item.id,
            });
        } else {
            setForm({
                ticket_id: item.id
            })
        }
    }, []);

    const handleConfirm = async (evt) => {
        evt.preventDefault();
        const handler = isUpdate ? updateAppointment : createAppointment;
        handler.mutate({ id: item?.id, body: form });
    };

    const handleChange = (evt) => {
        const { target: { name, value } } = evt;
        setForm({ ...form, [name]: value });
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={isUpdate ? 'Update Appointment' : 'Create Appointment'} onClose={closeModal} />
            <ModalBody>
                <form onSubmit={handleConfirm} className='p-6'>
                    <Input onChange={handleChange} type={'datetime-local'} value={form.book_start} label={'Start'} name={'book_start'} />
                    <Input onChange={handleChange} type={'datetime-local'} value={form.book_end} label={'End'} name={'book_end'} />
                    {/* TODO: add inputs */}
                </form>
            </ModalBody>
            <ModalFooter>
                <Button color={'green'} onClick={handleConfirm}>{isUpdate ? 'Update' : 'Create'}</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};
