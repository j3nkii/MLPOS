import axios from 'axios'

const invoiceService = {
    createInvoice: (body) => axios.post('/api/invoices', body),
    readInvoice: (invoiceID) => axios.get(`/api/invoices/${invoiceID}`),
    readAllInvoices: () => axios.get(`/api/invoices`),
    updateInvoice: (invoiceID, body) => axios.put(`/api/invoices/${invoiceID}`, body),
    deleteInvoice: (invoiceID) =>  axios.delete(`/api/invoices/${invoiceID}`),
}

export default invoiceService;
