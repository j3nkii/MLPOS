import axios from 'axios'

export const userService = {
    readUser: () => axios.get('/api/user'),
}
