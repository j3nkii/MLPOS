import 'react';
import { Table } from '@components';
import { useProductQuery } from '@query';



export const ProductsPage = () => {
    const { readAllProducts } = useProductQuery();
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-10 text-4xl font-extrabold'>Products:</h1>
            <Table config={'products'} data={readAllProducts?.data?.data} />
        </div>
    );
};
