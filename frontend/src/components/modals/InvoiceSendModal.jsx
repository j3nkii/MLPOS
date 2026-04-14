
import React, { useEffect, useState,  useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@components';
import { useModalZussy} from '@zussy';
import { Button, Input } from '@components';
import { useParams } from 'react-router-dom';


export const InvoiceSendModal = ({ isUpdate }) => {
    const params = useParams();
    // const { createInvoiceItem, updateInvoiceItem } = useInvoiceQuery();
    const { item, closeModal  } = useModalZussy();

    const handleConfirm = async () => {
        const payload = { invoiceID: params.invoiceID }
        // handleFn.mutate(payload);
        closeModal();
    };

    return (
        <Modal onClose={closeModal}>
            <ModalHeader title={'Send Invoice'} onClose={closeModal} />
            <ModalBody>
            </ModalBody>
                <div>
                    {}
                </div>
            <ModalFooter>
                <Button color={'green'} onClick={handleConfirm}>Send</Button>
                <Button color={'black'} onClick={closeModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
    );
}