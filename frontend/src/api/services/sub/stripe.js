import axios from 'axios'

export const stripeService = {
    createAccount: () => axios.post('/api/stripe/', { email: 'json@mlpos.com'}),
    createPaymentLink: () => axios.post('/api/stripe/create-payment-link/', { email: 'json@mlpos.com'}),
    createAccountLink: () => axios.post('/api/stripe/create-account-link/', { stripeID: 'json@mlpos.com'}),
    createAccountSession: () => axios.get('/api/stripe/create-account-session/'),
}
