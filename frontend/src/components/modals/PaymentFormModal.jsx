
import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy} from '@zussy';
import { Button, Input } from '@components';

import { usePaymentQuery } from '@query';

import { useParams } from 'react-router-dom';

const INITIAL_FORM = {
    price: '',
    method: '',
};

export const PaymentFormModal = ({ isUpdate }) => {
    const params = useParams();
    const [modalTitle] = useState(isUpdate ? 'Update Payment' : 'Create Payment');
    const [paymentForm, setPaymentForm] = useState(INITIAL_FORM);
    const { createPayment, updatePayment } = usePaymentQuery();
    const { setModal, item, closeModal  } = useModalZussy();

    useEffect(() => {
        if(isUpdate){
            setPaymentForm({
                price: item.price,
                method: item.method,
            })
        } else if(item.total){
            setPaymentForm({
                ...INITIAL_FORM,
                price: item.balance
            })
        }
    }, []);

    const handleConfirm = async () => {
        const payload = { invoiceID: params.invoiceID, paymentID: item?.id, ...paymentForm }
        const handleFn = isUpdate ? updatePayment : createPayment;
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
                    <p>total is {item.total}</p>
                    <p>balance is {item.balance}</p>
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