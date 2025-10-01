import React, { useEffect, useState } from 'react';
import { Trash2, Settings, DiamondPlus, SquarePen, BookUser } from 'lucide-react';
import { useStateManager } from '@useStateManager';
import { Button } from '@components';



const HEADERS = {
    allCustomers: {
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

    // I know what i meant, currently being passed "keys"
    // that tell it what state to grab from local, this
    // could be a wrapper layer ontop of the like... paseed
    // component. component should receive props. 
    const appState = useStateManager();
    const [displayColumns, setDisplayColumns] = useState([])
    const [columnKeys, setColumnKeys] = useState([]);

    useEffect(() => {
        console.log(appState)
        const displayColumns = Object.values(HEADERS[data]);
        const columnKeys = Object.keys(HEADERS[data]);
        if(isManage) {
            displayColumns.push('Actions');
            columnKeys.push('actions');
        }
        setColumnKeys(columnKeys);
        setDisplayColumns(displayColumns);
    }, [data]);

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
                                { header === 'Actions' ? <ActionsHeader header={header} /> : header }
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
                                    { field === 'actions' ? <ActionsCell item={row} /> : row[field] || 'N/A'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};



const ActionsHeader = ({ header } ) => {
    const { setModal } = useStateManager();
    return (
        <div>
            { header }
            <Button
                onClick={() => setModal({ key: 'addCustomer' })}
                text="Create"
            >
                <DiamondPlus />
            </Button>
        </div>
    )
}



const ActionsCell = ({ item }) => {
    const { setModal, setSelectedCustomer } = useStateManager();

    const onDelete = (e) => {
        console.log('hey clicking delete')
        e.stopPropagation();
        setModal({
            // could be renamed key
            key: 'confirmDelete',
            item,
        });
    };

    const onEdit = (e) => {
        console.log('hey clicking delete')
        e.stopPropagation();
        setSelectedCustomer(item);
        setModal({
            // could be renamed key
            key: 'updateCustomer',
            item,
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
            ><BookUser />
            </Button>
        </div>
    );
}