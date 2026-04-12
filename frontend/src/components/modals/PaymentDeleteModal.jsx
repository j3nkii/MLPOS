
import 'react';
import { Modal, ModalHeader, ModalFooter, ModalBody } from '@components';
import { usePaymentQuery } from '@query';
import { useModalZussy} from '@zussy';
import { Button } from '@components';


export const PaymentDeleteModal = () => {
    const { deletePayment } = usePaymentQuery();
    const {closeModal} = useModalZussy();
    const { item: {selectedPayment: item}, item: shitter } = useModalZussy();

    const handleConfirm = async () => {
        deletePayment.mutate(item.id);
    };
        console.log(shitter)

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Delete Payment'} onClose={closeModal} />
            <ModalBody>
                <div className='p-6'>
                    <p>Are you sure you want to delete this payment?</p>
                    <p className='text-red-500'>{item.price}</p>
                </div>
            </ModalBody>

            <ModalFooter>
                <Button color={'red'} onClick={handleConfirm}>Delete</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}
