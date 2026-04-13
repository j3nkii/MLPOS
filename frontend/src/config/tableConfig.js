export const TABLE_CONFIG = {
    customers: {
        headers: [
            {
                display: 'Name',
                key: 'name'
            },
            {
                display: 'Phone',
                key: 'phone'
            },
            {
                display: 'Email',
                key: 'email'
            },
        ],
        tableActions: {
            update: 'updateCustomer',
            create: 'createCustomer',
            delete: 'confirmDelete',
        },
    },
    invoices: {
                headers: [
            {
                display: 'Customer',
                key: 'name'
            },
            {
                display: 'Amount',
                key: 'price'
            },
            {
                display: 'Status',
                key: 'status'
            },
            {
                display: 'Date Sent',
                key: 'created_at'
            }
        ],
        tableActions: {
            // update: 'updateInvoice',
            create: 'createInvoice',
            delete: 'deleteInvoice',
            detail: '/invoices/'
        },
    },
    lineItems: {
        headers: [
            {
                display: 'Name',
                key: 'name'
            },
            {
                display: 'Price',
                key: 'price'
            },
            {
                display: 'Quantity',
                key: 'quantity'
            }
        ],
        tableActions: {
            create: 'createLineItem',
            update: 'updateLineItem',
            delete: 'deleteLineItem',
        }
    },
    payments: {
        headers: [
            {
                display: 'Price',
                key: 'price'
            },
            {
                display: 'Method',
                key: 'method'
            }
        ],
        tableActions: {
            create: 'createPayment',
            update: 'updatePayment',
            delete: 'deletePayment',
        }
    }
}