import axios from 'axios'

export const stripeService = {
    createAccount: () => axios.post('/api/stripe/', { email: 'json@mlpos.com'}),
    createPaymentLink: () => axios.post('/api/stripe/create-payment-link/', { email: 'json@mlpos.com'}),
}
