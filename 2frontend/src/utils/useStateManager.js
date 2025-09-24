import { create } from 'zustand'
import axios from 'axios'




const MODAL_TYPES = ['confirmDelete']




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
        console.log(modalKey)
        if(!MODAL_TYPES.includes(modalKey.type))
            console.warn(`Modal Type: ${modalKey} : invalid`);
        else set({ modal: modalKey })
    },
    fetchCustomers: async () => getCustomersAPI(set),
})





export const useStateManager = create((set) => SUB_FUNCTION(set));