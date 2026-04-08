
import 'react';
import { Modal, ModalHeader, ModalFooter, ModalBody } from '@components';
import { useModalZussy} from '@zussy';
import { useInvoiceQuery } from '@query';
import { Button } from '@components';


export const InvoiceDeleteModal = () => {
    const { deleteInvoice } = useInvoiceQuery();
    const { item } = useModalZussy();
    const {closeModal} = useModalZussy();

    const handleConfirm = async () => {
        deleteInvoice.mutate({ invoiceID: item.id });
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Delete Invoice'} onClose={closeModal} />
            <ModalBody>
                <div className="p-6">
                    <p>Are you sure you want to delete this Invoice?</p>
                    <p className="text-red-500">{item.name}</p>
                </div>
            </ModalBody>

            <ModalFooter>
                <Button onClick={handleConfirm}>Delete</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}