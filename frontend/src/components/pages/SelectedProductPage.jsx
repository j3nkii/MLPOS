import { useEffect, useState } from 'react';
import { Button } from '@components';
import { useModalZussy } from '@zussy';
import { useProductQuery, useTicketQuery } from '@query';
import { useParams } from 'react-router-dom';


import { Trash2, Pencil } from 'lucide-react'



const INITIAL = {
    price: '',
    productID: '',
    status: '',
    details: [],
    payments: [],
};



export const SelectedProductPage = () => {
    const params = useParams();
    const { readAllProducts } = useProductQuery();
    const [selectedProduct, setSelectedProduct] = useState(INITIAL);
    const { setModal } = useModalZussy();

    useEffect(() => {
        const { productID } = params;
        const productIndex = readAllProducts?.data?.data.findIndex(x => x.id === productID);
        const selectedProduct = readAllProducts?.data?.data[productIndex];
        if(selectedProduct){
            setSelectedProduct(selectedProduct);
        }
    }, [readAllProducts?.data?.data]);

    const onDelete = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'deleteProduct',
            item: selectedProduct,
        });
    };

    const onUpdate = (e) => {
        e.stopPropagation();
        setModal({
            modalKey: 'updateProduct',
            item: selectedProduct,
        });
    };

    return (
        <div className='max-w-170 bg-white'>
            <h1 className=' text-4xl font-extrabold'>{selectedProduct.id}</h1>
            <div className='flex'>
                <div className='flex items-center'>
                    <Button
                        color='yellow'
                        onClick={onUpdate} 
                        text='Update'
                    ><Pencil />
                    </Button>
                    <Button
                        color={'red'}
                        onClick={onDelete} 
                        text='Delete'
                    ><Trash2 />
                    </Button>
                </div>
            </div>
        </div>
    );
}
