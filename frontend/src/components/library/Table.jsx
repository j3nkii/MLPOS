import { useState } from 'react'
import { Trash2, DiamondPlus, BookUser, Pencil } from 'lucide-react'
import { useModalZussy} from '@zussy'
import { Button } from '@components'
import { useNavigate } from 'react-router-dom'

import { TABLE_CONFIG } from '@config/tableConfig';




export const Table = ( PROPS ) => {
    const { data = [], isManage = true, config = '', theme = 'default', footer = {} } = PROPS;
    const displayColumns = TABLE_CONFIG[config].headers.map(x => x.display);
    const columnKeys = TABLE_CONFIG[config].headers.map(x => x.key);
    const tableActions = TABLE_CONFIG[config].tableActions;
    const tableStyles = TABLE_THEMES[theme];
    return (
        <div className={tableStyles.container}>
            <table className={tableStyles.table}>
                <thead>
                    <tr className={tableStyles.tableHTR}>
                        {displayColumns.map((header, index) => (
                            <th 
                                key={index} 
                                className={tableStyles.tableTH}
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
                            className={tableStyles.tableBTR}
                        >
                            {columnKeys.map((field, colIndex) => (
                                <td 
                                    key={colIndex} 
                                    className={tableStyles.tableTD}
                                >
                                    { row[field] || 'N/A'}
                                </td>
                            ))}
                        { isManage && <ActionsCell item={row} tableActions={tableActions} /> }
                        </tr>
                    ))}
                </tbody>
                {config === 'lineItems' && (
                    <tfoot>
                        <tr className={tableStyles.tableHTR}>
                            <td className={tableStyles.tableTF}>Total</td>
                            <td className={tableStyles.tableTF}>{footer.total}</td>
                            <td className={tableStyles.tableTF}></td>
                            <td className={tableStyles.tableTF}></td>
                        </tr>
                        
                    </tfoot>
                )}
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

    const onDelete = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: tableActions.delete,
            item,
        });
    };

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
                {!tableActions.detail && <Button
                    color={'red'}
                    onClick={onDelete} 
                    text='Delete'
                ><Trash2 />
                </Button>}
            </div>
        </td>
    );
}

const TABLE_THEMES = {
    default: {
        container: 'rounded-2xl overflow-hidden border-10',
        table: 'min-w-full border-collapse table-fixed w-full bg-white',
        tableHTR: 'bg-black',
        tableTH: 'px-4 py-3 pt-0 text-right text-white',
        tableTF: 'px-4 py-3 pb-0 text-right text-white',
        tableBTR: 'hover:bg-black hover:text-white hover:border-black duration-200  border-b border-gray-100',
        tableTD: 'px-4 py-3 text-right'
    },
    // payments: {
    //     container: 'rounded-2xl overflow-hidden border-2',
    //     table: 'min-w-full border-collapse table-fixed w-full bg-white shadow-sm',
    //     tableHTR: 'bg-gray-200',
    //     tableTH: 'px-4 py-3 text-left　font-medium text-gray-900',
    //     tableBTR: 'hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200  border-b border-gray-200',
    //     tableTD: 'px-4 py-3 text-gray-900'
    // },
    // invoiceItems: {
    //     container: 'rounded-2xl overflow-hidden border-2',
    //     table: 'min-w-full border-collapse table-fixed w-full bg-white shadow-sm',
    //     tableHTR: 'bg-gray-200',
    //     tableTH: 'px-4 py-3 text-left　font-medium text-gray-900',
    //     tableBTR: 'hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200  border-b border-gray-200',
    //     tableTD: 'px-4 py-3 text-gray-900'
    // },
}
