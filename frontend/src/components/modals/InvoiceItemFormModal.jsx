
import React, { useEffect, useState,  useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy} from '@zussy';
import { Button, Input } from '@components';

import { useInvoiceQuery } from '@query';

import { useParams } from 'react-router-dom';

const INITIAL_FORM = {
    name: '',
    price: 0,
    quantity: 1,
};

export const InvoiceItemFormModal = ({ isUpdate }) => {
    const indexRef = useRef()
    const params = useParams();
    const [modalTitle] = useState(isUpdate ? 'Update Invoice Item' : 'Create Invoice Item');
    const [invoiceItemForm, setInvoiceItemForm] = useState(INITIAL_FORM);
    const { createInvoiceItem, updateInvoiceItem } = useInvoiceQuery();
    const { setModal, item, closeModal  } = useModalZussy();

    useEffect(() => {
        if(isUpdate){
            setInvoiceItemForm({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
            });
        }
    }, []);

    const handleConfirm = async (evt, isNext) => {
        evt.preventDefault();
        const payload = { invoiceID: params.invoiceID, invoiceItemID: item?.id, body: invoiceItemForm }
        const handleFn = isUpdate ? updateInvoiceItem : createInvoiceItem;
        handleFn.mutate(payload);
        if(isNext)return;
        closeModal();
    };

    const saveAndNext = (evt) => {
        evt.preventDefault();
        handleConfirm(evt, true);
        setInvoiceItemForm(INITIAL_FORM);
        indexRef?.current.focus()
    }

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setInvoiceItemForm({ ...invoiceItemForm, [name]: value });
    }

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={modalTitle} onClose={closeModal} />
            <ModalBody>
                <form className='p-6'>
                    <Input onSubmit={saveAndNext} ref={indexRef} onChange={handleChange} value={invoiceItemForm.name || ''} label={'Name'} name={'name'} />
                    <Input type={'number'} onChange={handleChange} value={invoiceItemForm.price || ''} label={'Price'} name={'price'} />
                    <Input type={'number'} onChange={handleChange} value={invoiceItemForm.quantity || ''} label={'Quantity'} name={'quantity'} />
                    <button onClick={saveAndNext} type='submit' style={{ display: 'none' }}></button>
                </form>
            </ModalBody>

            <ModalFooter>
                <Button color={'green'} onClick={handleConfirm}>Create</Button>
                <Button color={'black'} onClick={saveAndNext}>Create + Next</Button>
            </ModalFooter>
        </Modal>
    );
}