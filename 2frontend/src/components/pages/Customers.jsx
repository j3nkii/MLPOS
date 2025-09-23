import React from 'react';
import { Button, Input, Table } from '@components';

const EXAMPLE_DATA = [
    {
        "id": "ef9d6330-0962-4c92-8c41-635b3b666dfc",
        "user_id": "52d9665a-3187-4b0c-8316-487784bf84a0",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "555-1234",
        "is_deleted": false,
        "created_at": "2025-09-23T19:37:37.731Z",
        "updated_at": "2025-09-23T19:37:37.731Z"
    },
    {
        "id": "7e01f1fd-9c01-4e29-9109-23365b166e92",
        "user_id": "52d9665a-3187-4b0c-8316-487784bf84a0",
        "name": "Mary Smith",
        "email": "mary@example.com",
        "phone": "555-5678",
        "is_deleted": false,
        "created_at": "2025-09-23T19:37:37.731Z",
        "updated_at": "2025-09-23T19:37:37.731Z"
    }
]


export const CustomersPage = () => {
    console.log('custoemrs page')
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-500">
            <Table data={EXAMPLE_DATA} />
        </div>
    );
};
