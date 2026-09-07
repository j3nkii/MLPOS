import axios from 'axios'

export const stripeService = {
    createAccount: () => axios.post('/api/stripe/', { email: 'json@mlpos.com'}).then(res => res.data),
    createPaymentLink: () => axios.post('/api/stripe/create-payment-link/', { email: 'json@mlpos.com'}).then(res => res.data),
    createAccountLink: () => axios.post('/api/stripe/create-account-link/', { stripeID: 'json@mlpos.com'}).then(res => res.data),
    createAccountSession: () => axios.get('/api/stripe/create-account-session/').then(res => res.data),
}
