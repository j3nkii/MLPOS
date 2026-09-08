import React, { useState, useEffect } from 'react';
import { Button, Input } from '@components';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy } from '@zussy';
import { useProductQuery } from '@query';



const INITIAL = {};

export const ProductFormModal = ({ isUpdate }) => {
    const [form, setForm] = useState(INITIAL);
    const { createProduct, updateProduct } = useProductQuery();
    const { closeModal, item } = useModalZussy();
    
        useEffect(() => {
            if(isUpdate){
                setForm({
                    name: item.name,
                    price: item.price,
                })
            }
        }, []);

    const handleConfirm = async (evt) => {
        evt.preventDefault();
        const handler = isUpdate ? updateProduct : createProduct;
        handler.mutate({ id: item?.id, body: form });
    };

    const handleChange = (evt) => {
        const { target: { name, value } } = evt;
        setForm({ ...form, [name]: value });
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={isUpdate ? 'Update Product' : 'Create Product'} onClose={closeModal} />
            <ModalBody>
                <form onSubmit={handleConfirm} className='p-6'>
                    <Input onChange={handleChange} value={form.name} label={'Name'} name={'name'} />
                    <Input onChange={handleChange} value={form.price} label={'Price'} name={'price'} />
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
