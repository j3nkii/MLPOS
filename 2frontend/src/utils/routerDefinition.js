import React from 'react';
import { LogginsPage, CustomersPage, Layout } from '@components';



export const routerDefinition = [
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
                path: "/",
                exact: true,
                Component: CustomersPage
            },
        ]
    },
];