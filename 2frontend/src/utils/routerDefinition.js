import React from 'react';
import { LogginsPage, CustomersPage, AuthRoute } from '@components';



export const routerDefinition = [
    {
        path: "/login",
        exact: true,
        Component: LogginsPage
    },
    {
        path: "/",
        Component: AuthRoute,
        children: [
            {
                path: "/",
                exact: true,
                Component: CustomersPage
            },
        ]
    },
];