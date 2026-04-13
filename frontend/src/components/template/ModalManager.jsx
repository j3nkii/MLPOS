
import 'react';
import { CustomerDeleteModal, CustomerFormModal, InvoiceFormModal, InvoiceDeleteModal, PaymentFormModal, PaymentDeleteModal, InvoiceDetailFormModal } from '@components';
import { useModalZussy} from '@zussy';


export const ModalManager = () => {
    const { modalKey } = useModalZussy();
    switch (modalKey) {
        case 'confirmDelete':
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
            return <InvoiceDetailFormModal />
        case 'updateInvoiceLine':
            return <InvoiceDetailFormModal isUpdate={true}  />
        case null:
            return null;
        default:
            console.warn('INVALID MODAL ::', modalKey)
            return null;
    }
};
