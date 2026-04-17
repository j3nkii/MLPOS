
import 'react';
import { useModalZussy} from '@zussy';
import {
    CustomerDeleteModal,
    CustomerFormModal,
    TicketFormModal,
    TicketDeleteModal,
    PaymentFormModal,
    PaymentDeleteModal,
    TicketItemFormModal,
    TicketItemDeleteModal,
    TicketSendModal,
    // ::PLOPPIN_IMPORT::
} from '@components';


export const ModalManager = () => {
    const { modalKey } = useModalZussy();
    switch (modalKey) {
        case 'deleteCustomer':
            return <CustomerDeleteModal />
        case 'createCustomer':
            return <CustomerFormModal />
        case 'updateCustomer':
            return <CustomerFormModal isUpdate={true} />
        case 'createTicket':
            return <TicketFormModal />
        case 'updateTicket':
            return <TicketFormModal isUpdate={true} />
        case 'deleteTicket':
            return <TicketDeleteModal />
        case 'deletePayment':
            return <PaymentDeleteModal />
        case 'createPayment':
            return <PaymentFormModal />
        case 'updatePayment':
            return <PaymentFormModal isUpdate={true}  />
        case 'createTicketLine':
            return <TicketItemFormModal />
        case 'updateTicketLine':
            return <TicketItemFormModal isUpdate={true}  />
        case 'deleteTicketLine':
            return <TicketItemDeleteModal />
        case 'sendTicket':
            return <TicketSendModal />
        // ::PLOPPIN_SWITCH::
        case null:
            return null;
        default:
            return null;
    }
};
