import React, { useEffect, useState } from 'react'
import { Trash2, Settings, DiamondPlus, SquarePen, BookUser } from 'lucide-react'
import { useStateManager } from '@useStateManager'
import { Button } from '@components'
import { TABLE_CONFIG } from '@config/tableConfig'




export const Table = ( PROPS ) => {
    const { data = [], onClick, isManage = true, displayColumns = [], columnKeys = [], modalKeys = {} } = PROPS;
    return (
        <div className="w-full overflow-x-auto">
            <table className="table-fixed w-full border-collapse bg-white shadow-sm">
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
                        { isManage && <ActionsHeader modalKeys={modalKeys} /> }
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
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
                                    { row[field] || 'N/A'}
                                </td>
                            ))}
                        { isManage && <ActionsCell item={row} modalKeys={modalKeys} /> }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};





const ActionsHeader = ({ modalKeys }) => {
    const { setModal } = useStateManager();
    return (
        <td>
            <div>
                Add New
                <Button
                    onClick={() => setModal({ key: modalKeys.create })}
                    text="Create"
                >
                    <DiamondPlus />
                </Button>
            </div>
        </td>
    )
}





const ActionsCell = ({ item, modalKeys }) => {
    const { setModal, setSelectedCustomer } = useStateManager();

    const onDelete = (e) => {
        e.stopPropagation();
        setModal({
            key: modalKeys.delete,
            item,
        });
    };

    const onUpdate = (e) => {
        e.stopPropagation();
        setSelectedCustomer(item);
        setModal({
            key: modalKeys.update,
            item,
        });
    };

    return (
        <td>
            <div className="flex items-center space-x-2">
                <Button 
                    onClick={onDelete} 
                    text="Delete"
                >
                    <Trash2 />
                </Button>
                <Button 
                    onClick={onUpdate} 
                    text="Settings"
                ><BookUser />
                </Button>
            </div>
        </td>
    );
}