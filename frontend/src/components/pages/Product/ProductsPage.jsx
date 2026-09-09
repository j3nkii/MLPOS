import 'react';
import { Table } from '@components';
import { useProductQuery } from '@query';



export const ProductsPage = () => {
    const { readAllProducts } = useProductQuery();
    const inventoryProducts = readAllProducts?.data?.filter(x => x.product_type === 'inventory');
    const serviceProducts = readAllProducts?.data?.filter(x => x.product_type === 'service');
    return (
        <div className='max-w-170 bg-white'>
            <h1 className='p-10 pt-10 text-4xl font-extrabold'>Products:</h1>
            <Table config={'products'} data={inventoryProducts} />
            <h1 className='p-10 pt-10 text-4xl font-extrabold'>Services:</h1>
            <Table config={'products'} data={serviceProducts} />
        </div>
    );
};
