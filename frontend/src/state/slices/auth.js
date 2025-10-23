import axios from 'axios'
const INITIAL_LOGIN = {
    username: '',
    password: '',
}

export const createAuthSlice = (set, get) => {
    const setAuth = (partial) => set(state => ({
        auth: { ...state.auth, ...partial }
    }));
    return {
        user: null,
        loginForm: INITIAL_LOGIN,

        fetchUser: async () => {
            const { auth: { loginForm }, initApplication } = get();
            setAuth({ isLoading: true, error: null });
            try {
                const res = await axios.post('/api/user', loginForm);
                setAuth({ user: res.data, isLoading: false, loginForm: INITIAL_LOGIN });
                initApplication();
            } catch (err) {
                console.log(err)
                setAuth({ error: err.message, isLoading: false });
            }
        },

        setLoginForm: ({ name, value }) => {
            const { auth: { loginForm }} = get();
            setAuth({ loginForm: { ...loginForm, [name]: value } });
        },

        clearLoginForm: () => setAuth({ loginForm: INITIAL_LOGIN }),

        logout: () => setAuth({ user: null }),
    }
};