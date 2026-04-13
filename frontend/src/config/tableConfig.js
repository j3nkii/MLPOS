export const TABLE_CONFIG = {
    customers: {
        pageTitle: 'Customers',
        listKey: 'readAllCustomers',
        stateKey: 'allCustomers',
        headers: {
            name: 'Name',
            phone: 'Phone',
            email: 'Email',
        },
        modalKeys: {
            update: 'updateCustomer',
            create: 'createCustomer',
            delete: 'confirmDelete',
        },
    },
    invoices: {
        pageTitle: 'Invoices',
        listKey: 'readAllCustomers',
        stateKey: 'allCustomers',
        headers: {
            customer: 'Customer',
            price: 'Amount',
            status: 'Status',
            dateSent: 'Date Sent'
        },
        modalKeys: {
            detail: '',
            create: '',
            delete: '',
        },
    },
    lineItems: {
        headers: [
            {
                display: 'Item',
                key: 'item'
            },
            {
                display: 'Amount',
                key: 'amount'
            },
            {
                display: 'Quantity',
                key: 'quantity'
            }
        ],
        actions: {
            create: 'createLineItem',
            update: 'updateLineItem',
            delete: 'deleteLineItem',
        }
    },
    lineItems: {
        headers: [
            {
                display: 'Item',
                key: 'item'
            },
            {
                display: 'Amount',
                key: 'amount'
            },
            {
                display: 'Quantity',
                key: 'quantity'
            }
        ],
        actions: {
            create: 'createLineItem',
            update: 'updateLineItem',
            delete: 'deleteLineItem',
        }
    }
}