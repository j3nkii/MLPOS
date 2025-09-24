import { create } from 'zustand'
import axios from 'axios'

const SAMPLE_CUSTOMERS = [
        {
            "id": "ef9d6330-0962-4c92-8c41-635b3b666dfc",
            "user_id": "52d9665a-3187-4b0c-8316-487784bf84a0",
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "555-1234",
            "is_deleted": false,
            "created_at": "2025-09-23T19:37:37.731Z",
            "updated_at": "2025-09-23T19:37:37.731Z"
        },
        {
            "id": "7e01f1fd-9c01-4e29-9109-23365b166e92",
            "user_id": "52d9665a-3187-4b0c-8316-487784bf84a0",
            "name": "Mary Smith",
            "email": "mary@example.com",
            "phone": "555-5678",
            "is_deleted": false,
            "created_at": "2025-09-23T19:37:37.731Z",
            "updated_at": "2025-09-23T19:37:37.731Z"
        }
    ]


export const useStateManager = create((set) => ({
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
    },
    fetchCustomers: async () => {
        set({ isLoading: true, error: null })
        try {
            const res = await axios.get('/api/customers')
            set({ customers: res.data, isLoading: false })
        } catch (err) {
            set({ error: err.message, isLoading: false })
        }
    },
}));