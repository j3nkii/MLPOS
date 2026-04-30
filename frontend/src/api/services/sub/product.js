import axios from 'axios';

export const productService = {
    readAllProducts: () => axios.get(`/api/product`),
    // readProduct: ({ id }) => axios.get(`/api/product/${id}`),
    createProduct: ({ body }) => axios.post(`/api/product`, body),
    updateProduct: ({ id, body }) => axios.put(`/api/product/${id}`, body),
    deleteProduct: ({ id }) => axios.delete(`/api/product/${id}`),
};
