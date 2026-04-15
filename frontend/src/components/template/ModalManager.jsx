
import 'react';
import { useModalZussy} from '@zussy';
import { CustomerDeleteModal, CustomerFormModal, InvoiceFormModal, InvoiceDeleteModal, PaymentFormModal, PaymentDeleteModal, InvoiceItemFormModal, InvoiceItemDeleteModal, InvoiceSendModal } from '@components';


export const ModalManager = () => {
    const { modalKey } = useModalZussy();
    switch (modalKey) {
        case 'deleteCustomer':
            return <CustomerDeleteModal />
        case 'createCustomer':
            return <CustomerFormModal />
        case 'updateCustomer':
            return <CustomerFormModal isUpdate={true} />
        case 'createInvoice':
            return <InvoiceFormModal />
        case 'updateInvoice':
            return <InvoiceFormModal isUpdate={true} />
        case 'deleteInvoice':
            return <InvoiceDeleteModal />
        case 'deletePayment':
            return <PaymentDeleteModal />
        case 'createPayment':
            return <PaymentFormModal />
        case 'updatePayment':
            return <PaymentFormModal isUpdate={true}  />
        case 'createInvoiceLine':
            return <InvoiceItemFormModal />
        case 'updateInvoiceLine':
            return <InvoiceItemFormModal isUpdate={true}  />
        case 'deleteInvoiceLine':
            return <InvoiceItemDeleteModal />
        case 'sendInvoice':
            return <InvoiceSendModal />
        case null:
            return null;
        default:
            return null;
    }
};
