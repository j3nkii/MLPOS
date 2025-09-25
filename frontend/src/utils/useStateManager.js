import { create } from 'zustand'
import axios from 'axios'




const MODAL_TYPES = ['confirmDelete', '']




const getCustomersAPI = async (set) => {
    set({ isLoading: true, error: null })
    try {
        const res = await axios.get('/api/customers')
        set({ customers: res.data, isLoading: false })
    } catch (err) {
        set({ error: err.message, isLoading: false })
    }
}





const SUB_FUNCTION = (set) => ({
    loading: false,
    error: null,
    user: null,
    fetchUser: async () => {
        set({ isLoading: true, error: null })
        try {
            const res = await axios.get('/api/user')
            set({ user: res.data, isLoading: false })
        } catch (err) {
            set({ error: err.message, isLoading: false })
        }
    },
    customers: [],
    modal: null,
    setModal: (modalKey) => {
        if(!MODAL_TYPES.includes(modalKey.type))
            console.warn(`Modal Type: ${modalKey} : invalid`);
        set({ modal: modalKey })
    },
    closeModal: () => set({ modal: null }),
    fetchCustomers: async () => getCustomersAPI(set),
    logout: () => set({ user: null })
})





export const useStateManager = create((set) => SUB_FUNCTION(set));