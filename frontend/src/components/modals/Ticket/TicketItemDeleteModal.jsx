
import 'react';
import { Modal, ModalHeader, ModalFooter, ModalBody } from '@components';
import { useModalZussy} from '@zussy';
import { useTicketQuery } from '@query';
import { Button } from '@components';


export const TicketItemDeleteModal = () => {
    const { deleteTicketItem } = useTicketQuery();
    const { item } = useModalZussy();
    const {closeModal} = useModalZussy();

    const handleConfirm = async () => {
        deleteTicketItem.mutate({ ticketItemID: item.id });
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Delete Item Ticket'} onClose={closeModal} />
            <ModalBody>
                <div className='p-6'>
                    <p>Are you sure you want to delete this Ticket Item?</p>
                    <p className='text-red-500'>{item.name}</p>
                </div>
            </ModalBody>

            <ModalFooter>
                <Button color={'red'} onClick={handleConfirm}>Delete</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}