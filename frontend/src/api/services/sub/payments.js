import axios from 'axios'

export const paymentService = {
    createPayment: (body) => axios.post('/api/payments', body).then(res => res.data),
    updatePayment: (body) => axios.put(`/api/payments/`, body).then(res => res.data),
    deletePayment: (paymentID) => axios.delete(`/api/payments/${paymentID}`).then(res => res.data),
}
