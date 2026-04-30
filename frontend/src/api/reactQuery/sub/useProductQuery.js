import 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@services';
import { useModalZussy } from '@zussy';



export const useProductQuery = () => {
    const queryClient = useQueryClient();
    const { closeModal } = useModalZussy();

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
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    const updateProduct = useMutation({
        mutationFn: productService.updateProduct,
        onSuccess: async () => {
            await _refresh();
            queryClient.invalidateQueries({ queryKey: ['product'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    const deleteProduct = useMutation({
        mutationFn: productService.deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product'] });
            closeModal();
        },
        onError: (error) => console.error(error),
    });

    return {
        readAllProducts,
        // readProduct,
        createProduct,
        updateProduct,
        deleteProduct
    };
};
