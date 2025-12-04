import React from 'react';
import { AuthPage, Layout, CustomersPage, InvoicesPage } from '@components';



export const routerConfig = [
    {
        path: "/login",
        exact: true,
        Component: AuthPage
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
        ]
    },
];