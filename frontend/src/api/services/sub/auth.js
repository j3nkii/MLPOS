import axios from 'axios'

export const authService = {
    createAuth: (body) => axios.post('/api/auth/signup', body),
    createConfirm: (body) => axios.post('/api/auth/confirm', body),
    login: (body) => axios.post('/api/auth/login', body),
}
