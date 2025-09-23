import React, { useEffect, useState } from 'react';
import { Trash2, Settings } from 'lucide-react';
// import { useStateManager } from '@util/useStateManager';
import { Button } from '@components';



const HEADERS = {
    sources: {
        id: 'ID',
        label: 'Label',
        root_path: 'Root Path',
        added_at: 'Date Added',
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
    // const { appState } = useStateManager();
    const [displayHeaders, setDisplayHeaders] = useState([])
    const [effectiveHeaders, setEffectiveHeaders] = useState([]);

    useEffect(() => {
        const displayHeaders = Object.values(data);
        const effectiveHeaders = Object.keys(data);
        if(isManage) {
            displayHeaders.push('Actions');
            effectiveHeaders.push('actions');
        }
        setEffectiveHeaders(effectiveHeaders);
        setDisplayHeaders(displayHeaders);
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
                        {displayHeaders.map((header, index) => (
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
                    {data.map((row, rowIndex) => (
                        <tr 
                            key={rowIndex} 
                            className="cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200"
                            // onClick={(e) => handleRowClick(e, row)}
                        >
                            {effectiveHeaders.map((field, colIndex) => (
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
        e.stopPropagation();
        setModal({
            // could be renamed key
            type: 'deleteSource',
            title: 'Delete Confirmation',
            item
        });
    };
    return (
        <div className="flex items-center space-x-2">
            <Button 
                onClick={onDelete} 
                title="Delete"
            >
                <Trash2 />
            </Button>
            <Button 
                onClick={onEdit} 
                title="Settings"
            >
                <Settings />
            </Button>
        </div>
    );
}