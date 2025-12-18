import React from 'react'
import { Trash2, Settings, DiamondPlus, SquarePen, BookUser } from 'lucide-react'
import { useModal } from '@useState'
import { Button } from '@components'




export const Table = ( PROPS ) => {
    const { data = [], onClick, isManage = true, displayColumns = [], columnKeys = [], modalKeys = {} } = PROPS;
    return (
        <div className="rounded-2xl overflow-hidden border-2">
            <table className="min-w-full border-collapse table-fixed w-full bg-white shadow-sm">
                <thead>
                    <tr className='bg-gray-200'>
                        {displayColumns.map((header, index) => (
                            <th 
                                key={index} 
                                className="px-4 py-3 text-left　font-medium text-gray-900"
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
                            className="hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200  border-b border-gray-200"
                            // onClick={(e) => handleRowClick(e, row)}
                        >
                            {columnKeys.map((field, colIndex) => (
                                <td 
                                    key={colIndex} 
                                    className="px-4 py-3 text-gray-900"
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
    const { setModal } = useModal();
    return (
        <td>
            <div className='flex items-center justify-end gap-1 pr-3.5'>
                <Button
                    onClick={() => setModal({ modalKey: modalKeys.create })}
                    text="Create"
                ><DiamondPlus />
                </Button>
            </div>
        </td>
    )
}





const ActionsCell = ({ item, modalKeys }) => {
    const { setModal } = useModal();

    const onDelete = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: modalKeys.delete,
            item,
        });
    };

    const onUpdate = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: modalKeys.update,
            item,
        });
    };

    return (
        <td>
            <div className='flex items-center justify-end gap-3 pr-3.5'>
                <Button 
                    onClick={onUpdate} 
                    text="Settings"
                ><BookUser />
                </Button>
                <Button 
                    onClick={onDelete} 
                    text="Delete"
                ><Trash2 />
                </Button>
            </div>
        </td>
    );
}