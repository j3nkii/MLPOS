import 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@services';
import { useModalZussy, useToastZussy } from '@zussy';



export const useProductQuery = () => {
    const queryClient = useQueryClient();
    const { closeModal } = useModalZussy();
    const { addError, addSuccess } = useToastZussy();

    const _refresh = async () => {
        await queryClient.fetchQuery({
            queryKey: ['product'],
            queryFn: productService.readAllProducts,
            onError: (error) => console.error(error),
        });
    };

    const readAllProducts = useQuery({
        queryKey: ['product'],
        queryFn: productService.readAllProducts,
        onError: (error) => console.error(error),
    });

    // const readProduct = useQuery({
    //     queryKey: ['productWTF'],
    //     queryFn: productService.readProduct,
    //     onError: (error) => console.error(error),
    // });

    const createProduct = useMutation({
        mutationFn: productService.createProduct,
        onSuccess: async () => {
            await _refresh();
            queryClient.invalidateQueries({ queryKey: ['product'] });
            addSuccess('Product created.');
            closeModal();
        },
        onError: (error) => {
            addError('Product creation failed.');
            console.error(error);
        },
    });

    const updateProduct = useMutation({
        mutationFn: productService.updateProduct,
        onSuccess: async () => {
            await _refresh();
            queryClient.invalidateQueries({ queryKey: ['product'] });
            addSuccess('Product updated.');
            closeModal();
        },
        onError: (error) => {
            addError('Product update failed.');
            console.error(error);
        },
    });

    const deleteProduct = useMutation({
        mutationFn: productService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product'] });
            addSuccess('Product deleted.');
            closeModal();
        },
        onError: (error) => {
            addError('Product deletion failed.');
            console.error(error);
        },
    });

    return {
        readAllProducts,
        // readProduct,
        createProduct,
        updateProduct,
        deleteProduct
    };
};
