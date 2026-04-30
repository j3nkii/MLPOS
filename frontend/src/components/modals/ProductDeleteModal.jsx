import React from 'react';
import { Button } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy } from '@zussy';
import { useProductQuery } from '@query';



export const ProductDeleteModal = () => {
    const { deleteProduct } = useProductQuery();
    const { closeModal, item } = useModalZussy();

    const handleDelete = () => deleteProduct.mutate({ id: item?.id });

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Delete Product'} onClose={closeModal} />
            <ModalBody>
                <p className='p-6'>Are you sure you want to delete this Product?</p>
            </ModalBody>
            <ModalFooter>
                <Button color={'red'} onClick={handleDelete}>Delete</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
};
