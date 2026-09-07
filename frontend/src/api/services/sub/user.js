import axios from 'axios'

export const userService = {
    readUser: () => axios.get('/api/user').then(res => res.data),
}
