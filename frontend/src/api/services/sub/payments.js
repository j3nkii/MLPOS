import axios from 'axios'

export const paymentService = {
    createPayment: (body) => axios.post('/api/payments', body),
    updatePayment: (body) => axios.put(`/api/payments/`, body),
    deletePayment: (paymentID) => axios.delete(`/api/payments/${paymentID}`),
}
