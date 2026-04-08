
import 'react';
import { CustomerDeleteModal, CustomerFormModal, InvoiceFormModal, InvoiceDeleteModal } from '@components';
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
        case null:
            return null;
        default:
            console.warn('INVALID MODAL ::', modalKey)
            return null;
    }
};
