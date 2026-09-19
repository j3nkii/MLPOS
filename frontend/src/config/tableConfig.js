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
            // update: 'updateCustomer',
            create: 'createCustomer',
            delete: 'deleteCustomer',
            detail: '/customers/'
        },
    },
    tickets: {
        headers: [
            {
                display: 'Customer',
                key: 'name'
            },
            {
                display: 'Amount',
                key: 'price',
                format: 'money',
            },
            {
                display: 'Status',
                key: 'status'
            },
            {
                display: 'Date Sent',
                key: 'created_at',
                format: 'date'
            }
        ],
        tableActions: {
            // update: 'updateTicket',
            create: 'createTicket',
            delete: 'deleteTicket',
            detail: '/tickets/'
        },
    },
    customerTickets: {
        headers: [
            {
                display: 'Amount',
                key: 'price',
                format: 'money',
            },
            {
                display: 'Status',
                key: 'status'
            },
            {
                display: 'Date Sent',
                key: 'created_at',
                format: 'date'
            }
        ],
        tableActions: {
            create: 'createTicket',
            detail: '/tickets/'
        },
    },
    ticketItems: {
        headers: [
            {
                display: 'Name',
                key: 'name'
            },
            {
                display: 'Price',
                key: 'price',
                format: 'money',
            },
            {
                display: 'Quantity',
                key: 'quantity'
            },
            {
                display: 'Type',
                key: 'product_type'
            }
        ],
        tableActions: {
            create: 'createTicketLine',
            update: 'updateTicketLine',
            delete: 'deleteTicketLine',
        }
    },
    payments: {
        headers: [
            {
                display: 'Price',
                key: 'price',
                format: 'money',
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
    },
    products: {
        headers: [
            {
                display: 'Name',
                key: 'name'
            },
            {
                display: 'Price',
                key: 'price',
                format: 'money',
            },
            {
                display: 'Type',
                key: 'product_type'
            },
        ],
        tableActions: {
            create: 'createProduct',
            delete: 'deleteProduct',
            update: 'updateProduct',
            // detail: '/products/',
        }
    },
    appointments: {
        headers: [
            {
                display: 'Customer',
                key: 'name'
            },
            {
                display: 'Status',
                key: 'appointment_status'
            },
            {
                display: 'Start',
                key: 'book_start',
                format: 'date'
            },
            {
                display: 'End',
                key: 'book_end',
                format: 'date'
            },
        ],
        tableActions: {
            create: 'createAppointment',
            delete: 'deleteAppointment',
            detail: '/appointments/',
            detailFunc: (nav, item) => {
                nav(`/tickets/${item.ticket_id}`);
            }
        }
    },
    appointmentsTicketDetail: {
        headers: [
            {
                display: 'Status',
                key: 'appointment_status'
            },
            {
                display: 'Start',
                key: 'book_start',
                format: 'date'
            },
            {
                display: 'End',
                key: 'book_end',
                format: 'date'
            },
        ],
        tableActions: {
            create: 'createAppointment',
            delete: 'deleteAppointment',
            detail: '/appointments/',
            detailFunc: (nav, item) => {
                nav(`/tickets/${item.ticket_id}`);
            }
        }
    },
    // ::PLOPPIN::
}