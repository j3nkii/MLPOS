import React, { useState, useEffect } from 'react';
import { Button, Input } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy } from '@zussy';
import { useAppointmentQuery, useCustomerQuery, useTicketQuery } from '@query';
import { useParams } from 'react-router-dom';



const INITIAL = {
    book_start: '',
    book_end: '',
};

export const AppointmentFormModal = ({ isUpdate }) => {
    const { ticketID } = useParams();
    const [form, setForm] = useState(INITIAL);
    const { createAppointment, updateAppointment } = useAppointmentQuery();
    // const { readAllTickets } = useTicketQuery();
    // const { readAllCustomers } = useCustomerQuery();
    const { closeModal, item } = useModalZussy();

    useEffect(() => {
        if(isUpdate){
            const start = item?.book_start.replace(/(\-\d{2}:\d{2})/, '')
            const end = item?.book_end.replace(/(\-\d{2}:\d{2})/, '');
            setForm({
                id: item?.id,
                book_start: start,
                book_end: end,
                appointment_status: item?.appointment_status,
            });
        } else if(ticketID) {
            setForm({
                ticket_id: ticketID
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
                    { !ticketID && <Input onChange={handleChange} value={form.ticket_id} label={'Ticket'} name={'ticket_id'} />}
                    <Input onChange={handleChange} type={'datetime-local'} value={form.book_start} label={'Start'} name={'book_start'} />
                    <Input onChange={handleChange} type={'datetime-local'} value={form.book_end} label={'End'} name={'book_end'} />
                    { isUpdate && <Input onChange={handleChange} type={'select'} optionsType={'appointmentStatus'} value={form.appointment_status} label={'Status'} name={'appointment_status'} />}
                </form>
            </ModalBody>
            <ModalFooter>
                <Button color={'green'} onClick={handleConfirm}>{isUpdate ? 'Update' : 'Create'}</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};
