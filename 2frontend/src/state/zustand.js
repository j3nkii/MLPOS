import { create } from 'zustand'
import axios from 'axios'


export const useStore = create((set) => ({
    user: null,
    customers: [],
    loading: false,
    error: null,
    setCustomers: (customers) => set({ customers }),
    fetchUser: async () => {
        console.log(set)
        set({ isLoading: true, error: null })
        try {
            const res = await axios.get('/api/user')
            console.log(res)
            set({ user: res.data, isLoading: false })
        } catch (err) {
            set({ error: err.message, isLoading: false })
        }
    }
}));