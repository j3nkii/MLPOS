import React from 'react';
import { LogginsPage, Layout, TablePage } from '@components';



export const routerConfig = [
    {
        path: "/login",
        exact: true,
        Component: LogginsPage
    },
    {
        path: "/",
        Component: Layout,
        children: [
            {
                path: "/customers",
                exact: true,
                Component: TablePage
            },
            {
                path: "/invoices",
                exact: true,
                Component: TablePage
            },
        ]
    },
];