
import 'react';
import { Modal, ModalHeader, ModalFooter, ModalBody } from '@components';
import { useCustomerQuery } from '@query';
import { useModalZussy} from '@zussy';
import { Button } from '@components';


export const CustomerDeleteModal = () => {
    const { deleteCustomer } = useCustomerQuery();
    const {closeModal} = useModalZussy();
    const { item } = useModalZussy();

    const handleConfirm = async () => {
        deleteCustomer.mutate(item.id);
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Delete Customer'} onClose={closeModal} />
            <ModalBody>
                <div className='p-6'>
                    <p>Are you sure you want to delete this person?</p>
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
