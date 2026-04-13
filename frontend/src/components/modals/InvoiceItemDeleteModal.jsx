
import 'react';
import { Modal, ModalHeader, ModalFooter, ModalBody } from '@components';
import { useModalZussy} from '@zussy';
import { useInvoiceQuery } from '@query';
import { Button } from '@components';


export const InvoiceItemDeleteModal = () => {
    const { deleteInvoiceItem } = useInvoiceQuery();
    const { item } = useModalZussy();
    const {closeModal} = useModalZussy();

    const handleConfirm = async () => {
        deleteInvoiceItem.mutate({ invoiceItemID: item.id });
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Delete Item Invoice'} onClose={closeModal} />
            <ModalBody>
                <div className='p-6'>
                    <p>Are you sure you want to delete this Invoice Item?</p>
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