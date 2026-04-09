import { useState, useEffect } from 'react'
import { Trash2, Settings, DiamondPlus, SquarePen, BookUser, Pencil } from 'lucide-react'
import { Button, Input } from '@components'

// right now this is basically hard coded to invoice details. 
const reIndex = (x, index) => ({ ...x, index });

export const TableForm = ( PROPS ) => {
    const { isUpdate = false, details = [], setDetails, displayColumns = [], columnKeys = [] } = PROPS;
    const onAddInput = () => {
        const newInput = {}
        columnKeys.forEach((key) => newInput[key] = '');
        const result = [ ...details, newInput ]
        setDetails(result.map(reIndex));
    }
    const onDeleteInput = (row) => {
        const result = [ ...details ];
        result.splice(row.index, 1);
        setDetails(result.map(reIndex));
    }
    const handleChange = (evt, rowIndex) => {
        const { target: { name, value }} = evt;
        const result = [...details];
        result[rowIndex][name] = value;
        setDetails(result);
    }
    // const onEdit = (item) => {
    //     const result = [...details]
    //     result[item.index].inEdit = !result[item.index].inEdit
    //     setDetails(result)
    // }
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
                        <td>
                            <div className='flex items-center justify-end gap-1 pr-3.5'/>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    {details.map((row, rowIndex) => (
                        <tr 
                            key={rowIndex} 
                            className="hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200  border-b border-gray-200"
                        >
                            {columnKeys.map((field, colIndex) => (
                                <td 
                                    key={colIndex} 
                                    className="px-4 py-3 text-gray-900"
                                >
                                    <Input
                                        // disabled={!row.inEdit}
                                        onChange={(evt) => handleChange(evt, rowIndex)}
                                        value={details[rowIndex][field]}
                                        label={null}
                                        name={field}
                                    />
                                </td>
                            ))}
                            <ActionsCell
                                isUpdate={isUpdate}
                                item={row}
                                // onEdit={onEdit}
                                onDelete={onDeleteInput}
                            />
                        </tr>
                    ))}
                    <tr>
                        {columnKeys.map((field, colIndex) => (
                            <td 
                                key={colIndex} 
                                className="px-4 py-3 text-gray-900"
                            />
                        ))}
                        <AddInput onClick={onAddInput} />
                    </tr>
                </tbody>
            </table>
        </div>
    );
};





const AddInput = ({ onClick }) => {
    return (
        <td>
            <div className='flex items-center justify-end gap-1 pr-3.5'>
                <Button
                    color={'green'}
                    onClick={onClick}
                    text="Create"
                ><DiamondPlus />
                </Button>
            </div>
        </td>
    )
}





const ActionsCell = ({ item, onDelete, onEdit, isUpdate }) => {
    return (
        <td>
            <div className='flex items-center justify-end pr-3.5'>
                {/* {isUpdate && <Button 
                    onClick={() => onEdit(item)} 
                    text="Edit"
                ><Pencil />
                </Button>} */}
                <Button
                    color={'red'}
                    onClick={() => onDelete(item)} 
                    text="Delete"
                ><Trash2 />
                </Button>
                
            </div>
        </td>
    );
}