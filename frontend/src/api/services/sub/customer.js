import axios from 'axios'

export const customerService = {
    createCustomer: (body) => axios.post('/api/customer', body),
    readCustomer: (customerID) => axios.get(`/api/customer/${customerID}`),
    readAllCustomers: () => axios.get(`/api/customer`),
    updateCustomer: (customerID, body) => axios.put(`/api/customer/${customerID}`, body),
    deleteCustomer: (customerID) =>  axios.delete(`/api/customer/${customerID}`),
}
