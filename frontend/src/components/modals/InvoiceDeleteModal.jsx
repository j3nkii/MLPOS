
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
                <div className='p-6'>
                    <h2 className='text-red-600 text-4xl font-extrabold'>Are you sure you want to delete this Invoice?</h2>
                    <h1 className='p-10 pt-10 text-4xl font-extrabold'>#INV001: {item.name}; {item.status}</h1>
                </div>
            </ModalBody>

            <ModalFooter>
                <Button color={'red'} onClick={handleConfirm}>Delete</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}