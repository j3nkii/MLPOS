import 'react';
import { Loggin, Layout, CustomersPage, InvoicesPage, SelectedInvoicePage } from '@components';


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
        ]
    },
];