import axios from 'axios'

export const customerService = {
    createCustomer: ({ body }) => axios.post('/api/customer', body).then(res => res.data),
    readCustomer: (customerID) => axios.get(`/api/customer/${customerID}`).then(res => res.data),
    readAllCustomers: () => axios.get(`/api/customer`).then(res => res.data),
    updateCustomer: ({ customerID, body }) => axios.put(`/api/customer/${customerID}`, body).then(res => res.data),
    deleteCustomer: (customerID) =>  axios.delete(`/api/customer/${customerID}`).then(res => res.data),
}
