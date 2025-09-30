import { create } from 'zustand'
import axios from 'axios'




const MODAL_TYPES = ['confirmDelete', '']




const getCustomersAPI = async (set, get) => {
    set({ isLoading: true, error: null })
    try {
        const userID = get().user.id
        const res = await axios.get(`/api/customer?userID=${userID}`)
        set({ customers: res.data, isLoading: false })
    } catch (err) {
        set({ error: err.message, isLoading: false })
    }
}





const SUB_FUNCTION = (set, get) => ({
    loading: false,
    error: null,
    user: null,
    loginForm: {
        username: '',
        password: '',
    },
    fetchUser: async () => {
        set({ isLoading: true, error: null })
        try {
            const res = await axios.post('/api/user', get().loginForm);
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
    fetchAllCustomers: async () => getCustomersAPI(set, get),
    logout: () => set({ user: null }),
    setLoginForm: ({ name, value }) => {
        console.log(name, value)
        set({ loginForm: { ...get().loginForm, [name]: value } })
    },
    addNewCustomerForm: {
        name: '',
        phone: '',
        email: '',
    },
    setNewCustomerForm: ({ name, value }) => {
        console.log(name, value)
        set({ addNewCustomerForm: { ...get().addNewCustomerForm, [name]: value } })
    },
    submitNewCustomer: async () => {
        set({ isLoading: true, error: null })
        try {
            await axios.post('/api/customer', {
                ...get().addNewCustomerForm,
                userID: get().user.id
            });
            await getCustomersAPI(set)
            set({ isLoading: false })
        } catch (err) {
            set({ error: err.message, isLoading: false })
        }
    },
})





export const useStateManager = create((set, get) => SUB_FUNCTION(set, get));