import { useState } from 'react'
import { Trash2, DiamondPlus, BookUser, Pencil } from 'lucide-react'
import { useModalZussy} from '@zussy'
import { Button } from '@components'
import { useNavigate } from 'react-router-dom'

import { TABLE_CONFIG } from '@config/tableConfig';




export const Table = ( PROPS ) => {
    const { data = [], isManage = true, config = '' } = PROPS;
    const displayColumns = TABLE_CONFIG[config].headers.map(x => x.display);
    const columnKeys = TABLE_CONFIG[config].headers.map(x => x.key);
    const tableActions = TABLE_CONFIG[config].tableActions
    return (
        <div className='rounded-2xl overflow-hidden border-2'>
            <table className='min-w-full border-collapse table-fixed w-full bg-white shadow-sm'>
                <thead>
                    <tr className='bg-gray-200'>
                        {displayColumns.map((header, index) => (
                            <th 
                                key={index} 
                                className='px-4 py-3 text-left　font-medium text-gray-900'
                            >
                                {header}
                            </th>
                        ))}
                        { isManage && <ActionsHeader tableActions={tableActions} /> }
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr 
                            key={rowIndex} 
                            className='hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200  border-b border-gray-200'
                        >
                            {columnKeys.map((field, colIndex) => (
                                <td 
                                    key={colIndex} 
                                    className='px-4 py-3 text-gray-900'
                                >
                                    { row[field] || 'N/A'}
                                </td>
                            ))}
                        { isManage && <ActionsCell item={row} tableActions={tableActions} /> }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};





const ActionsHeader = ({ tableActions }) => {
    const { setModal } = useModalZussy();
    return (
        <td>
            <div className='flex items-center justify-end gap-1 pr-3.5'>
                <Button
                    color={'green'}
                    onClick={() => setModal({ modalKey: tableActions.create })}
                    text='Create'
                ><DiamondPlus />
                </Button>
            </div>
        </td>
    )
}





const ActionsCell = ({ item, tableActions }) => {
    const navigate = useNavigate();
    const { setModal } = useModalZussy();
    const [ICON] = useState(tableActions.detail ? BookUser : Pencil)

    // const onDelete = (e) => {
    //     e.stopPropagation();
    //     setModal({
    //         modalKey: tableActions.delete,
    //         item,
    //     });
    // };

    const onUpdate = (e) => {
        e.stopPropagation();
        if(tableActions.detail){
            navigate(item.id)
        } else {
            setModal({
                modalKey: tableActions.update,
                item,
            });
        }
        

    };

    return (
        <td>
            <div className='flex items-center justify-end pr-3.5'>
                <Button 
                    onClick={onUpdate} 
                    text='Settings'
                ><ICON />
                </Button>
                {/* <Button
                    color={'red'}
                    onClick={onDelete} 
                    text='Delete'
                ><Trash2 />
                </Button> */}
            </div>
        </td>
    );
}