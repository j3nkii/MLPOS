import 'react';
import {
    Loggin,
    Layout,
    CustomersPage,
    TicketsPage,
    SelectedTicketPage,
    SelectedCustomerPage,
    StripePage,
    // ::PLOPPIN_IMPORT::
} from '@components';


export const routerConfig = [
    {
        path: "/login",
        exact: true,
        Component: Loggin
    },
    {
        path: "/",
        Component: Layout,
        children: [
            {
                path: "/",
                exact: true,
                Component: StripePage
            },
            {
                path: "/customers",
                exact: true,
                Component: CustomersPage
            },
            {
                path: "/tickets",
                exact: true,
                Component: TicketsPage
            },
            {
                path: "/tickets/:ticketID",
                exact: true,
                Component: SelectedTicketPage
            },
            {
                path: "/customers/:customerID",
                exact: true,
                Component: SelectedCustomerPage
            },
            // ::PLOPPIN::
        ]
    },
];