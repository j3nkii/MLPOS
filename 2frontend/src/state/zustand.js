import { create } from 'zustand'
import axios from 'axios'


export const useStore = create((set) => ({
    user: null,
    customers: [],
    loading: false,
    error: null,
    setCustomers: (customers) => set({ customers }),
    fetchUser: async () => {
        set({ isLoading: true, error: null })
        try {
            const res = await axios.get('/api/user')
            set({ user: res.data, isLoading: false })
        } catch (err) {
            set({ error: err.message, isLoading: false })
        }
    }
}));