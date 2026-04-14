import axios from 'axios'

export const stripeService = {
    createAccount: () => axios.post('/api/stripe/', { email: 'json@mlpos.com'}),
}
