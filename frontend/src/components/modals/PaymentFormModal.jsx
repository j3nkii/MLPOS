
import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy} from '@zussy';
import { Button, Input } from '@components';

import { usePaymentQuery } from '@query';

const INITIAL_FORM = {
    price: '',
    method: '',
};

export const PaymentFormModal = ({ isUpdate }) => {
    const [modalTitle] = useState(isUpdate ? 'Update Payment' : 'Create Payment')
    const [paymentForm, setPaymentForm] = useState(INITIAL_FORM);
    const { createPayment, updatePayment } = usePaymentQuery();
    const { setModal, item } = useModalZussy();

    useEffect(() => {
        console.log(item)
        if(isUpdate){
            setPaymentForm({
                price: item.price,
                method: item.method,
            })
        }
    }, []);

    const closeModal = () => {
        // we need to close this modal to show the original update invoice modal. 
        setModal({ modalKey: 'updateInvoice' });
    }

    const handleConfirm = async () => {
        const payload = { paymentID: item?.id, body: paymentForm }
        const handleFn = isUpdate ? updatePayment : createPayment;
        // const handleFn = () => console.log('hey confirm payment');
        handleFn.mutate(payload);
    };

    const handleChange = (evt) => {
        const { target: { name, value }} = evt;
        setPaymentForm({ ...paymentForm, [name]: value });
    }

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={modalTitle} onClose={closeModal} />
            <ModalBody>
                <form className='p-6'>
                    <Input onChange={handleChange} value={paymentForm.price || ''} label={'Price'} name={'price'} />
                    <Input onChange={handleChange} value={paymentForm.method || ''} label={'Method'} name={'method'} />
                </form>
            </ModalBody>

            <ModalFooter>
                <Button color={'green'} onClick={handleConfirm}>Create</Button>
                <Button onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}