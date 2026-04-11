import axios from 'axios'

export const paymentService = {
    createPayment: (body) => axios.post('/api/payments', body),
    updatePayment: (paymentID) => axios.put(`/api/payments/${paymentID}`),
    deletePayment: (paymentID) => axios.delete(`/api/payments/${paymentID}`),
}
