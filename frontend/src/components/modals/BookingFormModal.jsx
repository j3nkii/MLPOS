import React, { useState, useEffect } from 'react';
import { Button, Input } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy } from '@zussy';
import { useBookingQuery } from '@query';



const INITIAL = {};

export const BookingFormModal = ({ isUpdate }) => {
    const [form, setForm] = useState(INITIAL);
    const { createBooking, updateBooking } = useBookingQuery();
    const { closeModal, item } = useModalZussy();

    useEffect(() => {
        if(isUpdate){
            setForm({
                id: item.id,
            });
        }
    }, []);

    const handleConfirm = async (evt) => {
        evt.preventDefault();
        const handler = isUpdate ? updateBooking : createBooking;
        handler.mutate({ id: item?.id, body: form });
    };

    const handleChange = (evt) => {
        const { target: { name, value } } = evt;
        setForm({ ...form, [name]: value });
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={isUpdate ? 'Update Booking' : 'Create Booking'} onClose={closeModal} />
            <ModalBody>
                <form onSubmit={handleConfirm} className='p-6'>
                    <Input onChange={handleChange} value={form.id} label={'ID'} name={'id'} />
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
