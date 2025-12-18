import axios from 'axios'

export const customerService = {
    createCustomer: (body) => axios.post('/api/customers', body),
    readCustomer: (customerID) => axios.get(`/api/customers/${customerID}`),
    readAllCustomers: () => axios.get(`/api/customers`),
    updateCustomer: (customerID, body) => axios.put(`/api/customers/${customerID}`, body),
    deleteCustomer: (customerID) =>  axios.delete(`/api/customers/${customerID}`),
}
