import axios from 'axios';

export const productService = {
    readAllProducts: () => axios.get(`/api/product`).then(res => res.data),
    // readProduct: ({ id }) => axios.get(`/api/product/${id}`).then(res => res.data),
    createProduct: ({ body }) => axios.post(`/api/product`, body).then(res => res.data),
    updateProduct: ({ id, body }) => axios.put(`/api/product/${id}`, body).then(res => res.data),
    deleteProduct: ({ id }) => axios.delete(`/api/product/${id}`).then(res => res.data),
};
