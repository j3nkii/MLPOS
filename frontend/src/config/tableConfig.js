export const TABLE_CONFIG = {
    customers: {
        pageTitle: 'Customers',
        listKey: 'fetchAllCustomers',
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
        listKey: 'fetchAllCustomers',
        stateKey: 'allCustomers',
        headers: {
            customer: 'Customer',
            amount: 'Amount',
            status: 'Status',
            dateSent: 'Date Sent'
        },
        modalKeys: {
            update: '',
            create: '',
            delete: '',
        },
    }
}