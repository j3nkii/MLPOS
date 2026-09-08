import React from 'react';
import { Button } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy } from '@zussy';
import { useAppointmentQuery } from '@query';



export const AppointmentDeleteModal = () => {
    const { deleteAppointment } = useAppointmentQuery();
    const { closeModal, item } = useModalZussy();

    const handleDelete = () => deleteAppointment.mutate({ id: item?.id });

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Delete Appointment'} onClose={closeModal} />
            <ModalBody>
                <p className='p-6'>Are you sure you want to delete this Appointment?</p>
            </ModalBody>
            <ModalFooter>
                <Button color={'red'} onClick={handleDelete}>Delete</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};
