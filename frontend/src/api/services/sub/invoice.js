import axios from 'axios'

export const invoiceService = {
    createInvoice: (body) => axios.post('/api/invoice', body),
    readInvoice: (invoiceID) => axios.get(`/api/invoice/${invoiceID}`),
    readAllInvoices: () => axios.get(`/api/invoice`),
    updateInvoice: (invoiceID, body) => axios.put(`/api/invoice/${invoiceID}`, body),
    deleteInvoice: (invoiceID) =>  axios.delete(`/api/invoice/${invoiceID}`),
}
