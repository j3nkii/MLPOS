import React, { useEffect, useState } from 'react';
import { Trash2, Settings } from 'lucide-react';
import { useStateManager } from '@useStateManager';
import { Button } from '@components';



const HEADERS = {
    customers: {
        name: 'Name',
        phone: 'Phone',
        email: 'Email',
    },
}





/**
 * Reusable table component that accepts headers and data
 * @param {Object} props
 * @param {String} props.data
 * @param {Array} props.data - Array of data objects
 * @param {Function} [props.onClick] - Optional click handler for rows
 * @param {string} [props.className] - Optional additional class name
 * @returns {JSX.Element}
 */


export const Table = ({ data, onClick, isManage }) => {
    // uhhhmmmmmm, maybe wrap the table in something???
    // cant really drap and drop into this bitch, writing 
    // this as a passed component, plus creating a wrapper
    // to tansform data / act as a stable state manager
    const appState = useStateManager();
    const [displayColumns, setDisplayColumns] = useState([])
    const [columnKeys, setColumnKeys] = useState([]);

    useEffect(() => {
        const displayColumns = Object.values(HEADERS[data]);
        const columnKeys = Object.keys(HEADERS[data]);
        if(isManage) {
            displayColumns.push('Actions');
            columnKeys.push('actions');
        }
        setColumnKeys(columnKeys);
        setDisplayColumns(displayColumns);
    }, [data]);


    // const handleRowClick = (event, rowData) => {
    //     if (onClick) {
    //         event.preventDefault();
    //         onClick(rowData);
    //     }
    // };

    const onDelete = (rowData) => {
        // Handle delete logic here
        console.log('Delete row:', rowData);
    };

    const onEdit = (rowData) => {
        // Handle edit logic here
        console.log('Edit row:', rowData);
        onClick(rowData);
    };




    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-sm">
                <thead>
                    <tr>
                        {displayColumns.map((header, index) => (
                            <th 
                                key={index} 
                                className="px-4 py-3 text-left bg-gray-50 font-medium text-gray-900"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {appState[data].map((row, rowIndex) => (
                        <tr 
                            key={rowIndex} 
                            className="cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200"
                            // onClick={(e) => handleRowClick(e, row)}
                        >
                            {columnKeys.map((field, colIndex) => (
                                <td 
                                    key={colIndex} 
                                    className="px-4 py-3 text-gray-900 border-b border-gray-200"
                                >
                                    { field === 'actions' ? <ActionsCell item={row} onDelete={onDelete} onEdit={() => onEdit(row)} /> : row[field] || 'N/A'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};



const ActionsCell = ({ onEdit, item }) => {
    const { setModal } = useStateManager();
    const onDelete = (e) => {
        console.log('hey clicking delete')
        e.stopPropagation();
        setModal({
            // could be renamed key
            type: 'confirmDelete',
            title: 'Delete Confirmation',
            item
        });
    };
    return (
        <div className="flex items-center space-x-2">
            <Button 
                onClick={onDelete} 
                text="Delete"
            >
                <Trash2 />
            </Button>
            <Button 
                onClick={onEdit} 
                text="Settings"
            >
                <Settings />
            </Button>
        </div>
    );
}