import React from 'react';
import { Button } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy } from '@zussy';
import { useBookingQuery } from '@query';



export const BookingDeleteModal = () => {
    const { deleteBooking } = useBookingQuery();
    const { closeModal, item } = useModalZussy();

    const handleDelete = () => deleteBooking.mutate({ id: item?.id });

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Delete Booking'} onClose={closeModal} />
            <ModalBody>
                <p className='p-6'>Are you sure you want to delete this Booking?</p>
            </ModalBody>
            <ModalFooter>
                <Button color={'red'} onClick={handleDelete}>Delete</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};
