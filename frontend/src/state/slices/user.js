import axios from 'axios'
const INITIAL_LOGIN = {
    username: '',
    password: '',
}

export const createUserSlice = (set, get) => ({
    user: null,
    loginForm: INITIAL_LOGIN,

    fetchUser: async () => {
        const { loginForm } = get();
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post('/api/user', loginForm);
            set({ user: res.data, isLoading: false, loginForm: INITIAL_LOGIN });
        } catch (err) {
            console.log(err)
            set({ error: err.message, isLoading: false });
        }
    },

    setLoginForm: ({ name, value }) => {
        const { loginForm } = get();
        set({ loginForm: { ...loginForm, [name]: value } });
    },

    clearLoginForm: () => set({ loginForm: INITIAL_LOGIN }),

    logout: () => set({ user: null }),
});