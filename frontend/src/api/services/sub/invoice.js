import axios from 'axios'

export const invoiceService = {
    readAllInvoices: () => axios.get(`/api/invoice`),
    createInvoice: ({ body }) => axios.post('/api/invoice', body),
    readInvoice: ({ invoiceID }) => axios.get(`/api/invoice/${invoiceID}`),
    updateInvoice: ({ invoiceID, body }) => axios.put(`/api/invoice/${invoiceID}`, body),
    deleteInvoice: ({ invoiceID }) =>  axios.delete(`/api/invoice/${invoiceID}`),
    createInvoiceItem: ({ invoiceID, body }) => axios.post(`/api/invoice/line-item/${invoiceID}`, body),
    updateInvoiceItem: ({ invoiceItemID, body }) => axios.put(`/api/invoice/line-item/${invoiceItemID}`, body),
    deleteInvoiceItem: ({ invoiceItemID }) =>  axios.delete(`/api/invoice/line-item/${invoiceItemID}`),
}
