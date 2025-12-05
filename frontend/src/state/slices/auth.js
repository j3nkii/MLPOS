import axios from 'axios'


const INITIAL_LOGIN = {
    email: '',
    password: '',
}


export const createAuthSlice = (set, get) => {
    const setSlice = (partial) => set(state => ({
        auth: { ...state.auth, ...partial }
    }));
    return {
        user: null,
        loginForm: INITIAL_LOGIN,

        fetchUser: async () => {
            const { initApplication } = get().general;
            const { loginForm } = get().auth;
            setSlice({ isLoading: true, error: null });
            try {
                const res = await axios.post('/api/user/login', loginForm);
                setSlice({ user: res.data, isLoading: false, loginForm: INITIAL_LOGIN });
                initApplication();
            } catch (err) {
                console.log(err)
                setSlice({ error: err.message, isLoading: false });
            }
        },

        setLoginForm: ({ name, value }) => {
            const { loginForm } = get().auth;
            setSlice({ loginForm: { ...loginForm, [name]: value } });
        },

        clearLoginForm: () => setSlice({ loginForm: INITIAL_LOGIN }),

        logout: () => setSlice({ user: null }),

        createUser: async () => {
            const { loginForm: { email, password }} = get().auth;
            setSlice({ isLoading: true, error: null });
            try {
                const res = await axios.post('/api/auth/signup', { email, password });
                setSlice({ user: res.data, isLoading: false, loginForm: INITIAL_LOGIN });
            } catch (err) {
                console.log(err)
                setSlice({ error: err.message, isLoading: false });
            }
        }
    }
};