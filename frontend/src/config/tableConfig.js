export const TABLE_CONFIG = {
    customers: {
        pageTitle: 'Customers',
        listKey: 'fetchAllCustomers',
        stateKey: 'allCustomers',
        // columnKeys: [],
        // columnHeaders: [],
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
    allInvoices: {
        headers: {
            customer: 'Customer',
            amount: 'Amount',
            status: 'Status'
        },
        modalKeys: {
            update: '',
            create: '',
            delete: '',
        },
    }
}