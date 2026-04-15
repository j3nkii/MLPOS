import 'react';
import { Loggin, Layout, CustomersPage, InvoicesPage, SelectedInvoicePage, SelectedCustomerPage, StripePage } from '@components';


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
                path: "/invoices",
                exact: true,
                Component: InvoicesPage
            },
            {
                path: "/invoices/:invoiceID",
                exact: true,
                Component: SelectedInvoicePage
            },
            {
                path: "/customers/:customerID",
                exact: true,
                Component: SelectedCustomerPage
            },
        ]
    },
];